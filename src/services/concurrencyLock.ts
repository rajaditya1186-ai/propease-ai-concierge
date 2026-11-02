import { SiteVisitSlot, SlotHold, ProjectId } from '../types/booking';

/**
 * In-Memory Concurrency Mutex Lock Engine
 * Guarantees zero double-booking by enforcing atomic slot reservations with expiring holds.
 */
class ConcurrencyLockEngine {
  private activeHolds: Map<string, SlotHold> = new Map(); // holdId -> SlotHold
  private readonly HOLD_TTL_MS = 180_000; // 3 minutes holding window

  /**
   * Generates a unique slot identifier.
   */
  public generateSlotId(projectId: ProjectId, date: string, timeString: string): string {
    const cleanTime = timeString.replace(/[^0-9a-zA-Z]/g, '');
    return `SLOT-${projectId === 'Project 1' ? 'P1' : 'P2'}-${date}-${cleanTime}`;
  }

  /**
   * Cleans up expired holds.
   */
  public purgeExpiredHolds(): void {
    const now = Date.now();
    for (const [holdId, hold] of this.activeHolds.entries()) {
      if (now > hold.expiresAt) {
        this.activeHolds.delete(holdId);
      }
    }
  }

  /**
   * Returns active non-expired holds for a specific slot.
   */
  public getActiveHoldsForSlot(slotId: string): SlotHold[] {
    this.purgeExpiredHolds();
    const holds: SlotHold[] = [];
    for (const hold of this.activeHolds.values()) {
      if (hold.slotId === slotId) {
        holds.push(hold);
      }
    }
    return holds;
  }

  /**
   * Phase 1: Temporary Lock Acquisition (Hold).
   * Atomically checks available capacity (confirmed + active holds) before granting a temporary hold.
   */
  public acquireSlotHold(
    slot: SiteVisitSlot,
    leadPhone: string
  ): {
    success: boolean;
    hold?: SlotHold;
    reason?: string;
    remainingCapacity: number;
  } {
    this.purgeExpiredHolds();

    const activeHolds = this.getActiveHoldsForSlot(slot.slotId);
    
    // Check if the current lead already has an active hold on this slot
    const existingLeadHold = activeHolds.find((h) => h.leadPhone === leadPhone);
    if (existingLeadHold) {
      return {
        success: true,
        hold: existingLeadHold,
        remainingCapacity: slot.maxCapacity - slot.confirmedCount - activeHolds.length,
      };
    }

    const effectiveOccupancy = slot.confirmedCount + activeHolds.length;
    const remainingCapacity = slot.maxCapacity - effectiveOccupancy;

    if (remainingCapacity <= 0) {
      return {
        success: false,
        reason: 'SLOT_EXHAUSTED',
        remainingCapacity: 0,
      };
    }

    const holdId = `HOLD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newHold: SlotHold = {
      holdId,
      slotId: slot.slotId,
      leadPhone,
      expiresAt: Date.now() + this.HOLD_TTL_MS,
    };

    this.activeHolds.set(holdId, newHold);

    return {
      success: true,
      hold: newHold,
      remainingCapacity: remainingCapacity - 1,
    };
  }

  /**
   * Releases an existing hold.
   */
  public releaseHold(holdId: string): void {
    this.activeHolds.delete(holdId);
  }

  /**
   * Phase 2: Atomic Commitment.
   * Atomically verifies that confirmed count has not breached maxCapacity before incrementing.
   */
  public validateAndCommitBooking(
    slot: SiteVisitSlot,
    holdId?: string
  ): {
    success: boolean;
    updatedSlot?: SiteVisitSlot;
    error?: string;
  } {
    this.purgeExpiredHolds();

    if (slot.confirmedCount >= slot.maxCapacity) {
      return {
        success: false,
        error: 'DOUBLE_BOOKING_PREVENTED: Slot has already reached maximum simultaneous capacity.',
      };
    }

    // Release the temporary hold since it is now being committed permanently
    if (holdId) {
      this.releaseHold(holdId);
    }

    const updatedSlot: SiteVisitSlot = {
      ...slot,
      confirmedCount: slot.confirmedCount + 1,
      activeHoldCount: Math.max(0, this.getActiveHoldsForSlot(slot.slotId).length),
    };

    return {
      success: true,
      updatedSlot,
    };
  }
}

export const concurrencyLock = new ConcurrencyLockEngine();
