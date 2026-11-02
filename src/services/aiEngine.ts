import { LanguageCode } from '../types/lead';
import { ProjectId } from '../types/booking';
import { UserIntent } from '../types/chat';
import { ProjectFactSheet } from '../types/factSheet';
import { TRANSLATIONS } from '../data/translations';

export interface ProcessedAIResponse {
  responseText: string;
  detectedIntent: UserIntent;
  toolCallTriggered?: string;
  isFlaggedForAudit: boolean;
  flagReason?: string;
  shouldPromptBookingModal?: boolean;
}

/**
 * Classifies user intent from natural language across English, Hindi, and Gujarati.
 */
export function classifyUserIntent(query: string): UserIntent {
  const q = query.toLowerCase();

  // 1. Discount / Negotiation Detection (Strict Boundary)
  if (
    q.includes('discount') ||
    q.includes('offer') ||
    q.includes('negotiat') ||
    q.includes('cheaper') ||
    q.includes('best price') ||
    q.includes('bargain') ||
    q.includes('कम') ||
    q.includes('छूट') ||
    q.includes('डिस्काउंट') ||
    q.includes('ઓછું') ||
    q.includes('ડિસ્કાઉન્ટ') ||
    q.includes('ભાવ ઘટાડો')
  ) {
    return 'ASK_DISCOUNT';
  }

  // 2. Human Escalation Intent
  if (
    q.includes('human') ||
    q.includes('person') ||
    q.includes('executive') ||
    q.includes('advisor') ||
    q.includes('call me') ||
    q.includes('speak') ||
    q.includes('talk to') ||
    q.includes('इंसान') ||
    q.includes('बात करनी') ||
    q.includes('कॉल') ||
    q.includes('માણસ') ||
    q.includes('વાત કરવી') ||
    q.includes('કોલ કરો')
  ) {
    return 'REQUEST_HUMAN';
  }

  // 3. Site Visit Intent
  if (
    q.includes('visit') ||
    q.includes('book') ||
    q.includes('tour') ||
    q.includes('schedule') ||
    q.includes('appointment') ||
    q.includes('slot') ||
    q.includes('विजिट') ||
    q.includes('बुक') ||
    q.includes('देखना') ||
    q.includes('વિઝિટ') ||
    q.includes('બુક') ||
    q.includes('જોવા આવવું')
  ) {
    return 'REQUEST_VISIT';
  }

  // 4. RERA Inquiries
  if (
    q.includes('rera') ||
    q.includes('registration') ||
    q.includes('approved') ||
    q.includes('legal') ||
    q.includes('रेरा') ||
    q.includes('રેરા')
  ) {
    return 'ASK_RERA';
  }

  // 5. Price / Budget Inquiries
  if (
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('rate') ||
    q.includes('lakh') ||
    q.includes('crore') ||
    q.includes('budget') ||
    q.includes('payment') ||
    q.includes('कीमत') ||
    q.includes('भाव') ||
    q.includes('લાખ') ||
    q.includes('કિંમત')
  ) {
    return 'ASK_PRICE';
  }

  // 6. Amenities & Facilities
  if (
    q.includes('amenit') ||
    q.includes('pool') ||
    q.includes('gym') ||
    q.includes('club') ||
    q.includes('pickleball') ||
    q.includes('park') ||
    q.includes('सुविधा') ||
    q.includes('સ્વિમિંગ') ||
    q.includes('સુવિધા') ||
    q.includes('ક્લબ')
  ) {
    return 'ASK_AMENITIES';
  }

  // 7. Location & Landmarks
  if (
    q.includes('location') ||
    q.includes('where') ||
    q.includes('address') ||
    q.includes('distance') ||
    q.includes('highway') ||
    q.includes('shela') ||
    q.includes('kaha') ||
    q.includes('पता') ||
    q.includes('कहाँ') ||
    q.includes('સરનામું') ||
    q.includes('ક્યાં')
  ) {
    return 'ASK_LOCATION';
  }

  // 8. Possession Date
  if (
    q.includes('possession') ||
    q.includes('ready') ||
    q.includes('completion') ||
    q.includes('when') ||
    q.includes('handover') ||
    q.includes('पजेशन') ||
    q.includes('कब') ||
    q.includes('ક્યારે') ||
    q.includes('પઝેશન')
  ) {
    return 'ASK_POSSESSION';
  }

  // 9. Greetings
  if (
    q.includes('hello') ||
    q.includes('hi') ||
    q.includes('hey') ||
    q.includes('namaste') ||
    q.includes('kem cho') ||
    q.includes('नमस्ते') ||
    q.includes('કેમ છો')
  ) {
    return 'GREETING';
  }

  // 10. Specifications (Carpet Area, BHK)
  if (
    q.includes('bhk') ||
    q.includes('carpet') ||
    q.includes('sqft') ||
    q.includes('area') ||
    q.includes('size') ||
    q.includes('flats') ||
    q.includes('apartments') ||
    q.includes('कारपेट') ||
    q.includes('કાર્પેટ')
  ) {
    return 'ASK_PROJECT_SPECS';
  }

  // Anything outside known fact sheet questions triggers the missing fact boundary
  return 'UNKNOWN_OFF_FACTSHEET';
}

/**
 * Generates an authoritative, fact-sheet grounded response.
 */
export function generateGroundedResponse(
  query: string,
  _projectId: ProjectId,
  factSheet: ProjectFactSheet,
  language: LanguageCode = 'en'
): ProcessedAIResponse {
  const intent = classifyUserIntent(query);
  const t = TRANSLATIONS[language];

  switch (intent) {
    // 1. Anti-Negotiation Boundary: AI NEVER quotes discounts
    case 'ASK_DISCOUNT': {
      let discountResp = '';
      if (language === 'gu') {
        discountResp = `અમારી સત્તાવાર કિંમત ${factSheet.configurations.map((c) => `${c.type} માટે ${c.priceRange}`).join(', ')} છે. ડેવલપરની નીતિ મુજબ ચેટ પર કોઈ ડિસ્કાઉન્ટ આપી શકાતું નથી. કોઈ પણ ખાસ પેમેન્ટ પ્લાનની ચર્ચા સાઇટ વિઝિટ દરમિયાન રૂબરૂ થઈ શકે છે. શું તમે આ સપ્તાહના અંતે સાઇટ વિઝિટ બુક કરવા માંગો છો?`;
      } else if (language === 'hi') {
        discountResp = `हमारी आधिकारिक कीमत ${factSheet.configurations.map((c) => `${c.type} के लिए ${c.priceRange}`).join(', ')} है। डेवलपर की सख्त नीति के अनुसार चैट पर कोई अतिरिक्त छूट संभव नहीं है। विशेष भुगतान योजनाओं पर केवल साइट विजिट के दौरान व्यक्तिगत रूप से चर्चा की जा सकती है। क्या आप एक स्लॉट देखना चाहेंगे?`;
      } else {
        discountResp = `Our official approved pricing for ${factSheet.commercialName} is ${factSheet.configurations.map((c) => `${c.type}: ${c.priceRange}`).join(' and ')}. Developer policy strictly prohibits quoting customized discounts over chat. Bespoke commercial schedules are finalized exclusively in person during your site visit. Would you like to schedule a tour?`;
      }

      return {
        responseText: discountResp,
        detectedIntent: 'ASK_DISCOUNT',
        isFlaggedForAudit: false,
        shouldPromptBookingModal: true,
      };
    }

    // 2. Human Escalation Intent
    case 'REQUEST_HUMAN': {
      return {
        responseText: t.humanHandoffNotice,
        detectedIntent: 'REQUEST_HUMAN',
        toolCallTriggered: 'escalate_to_executive',
        isFlaggedForAudit: true,
        flagReason: 'User explicitly requested a human sales advisor.',
      };
    }

    // 3. Site Visit Intent -> Triggers Booking Tool
    case 'REQUEST_VISIT': {
      let visitText = '';
      if (language === 'gu') {
        visitText = `${factSheet.commercialName} માટે સાઇટ વિઝિટનું આયોજન કરીએ! હું તમારા માટે ઉપલબ્ધ ખાલી સ્લોટ્સ ચકાસી રહ્યો છું. કૃપા કરીને નીચે આપેલા અનુકૂળ સમયમાંથી એક સ્લોટ પસંદ કરો.`;
      } else if (language === 'hi') {
        visitText = `${factSheet.commercialName} के लिए साइट विजिट का समय निर्धारित करते हैं! मैं आपके लिए खाली स्लॉट चेक कर रहा हूँ। कृपया नीचे दिए गए समय में से अपनी पसंद का स्लॉट चुनें।`;
      } else {
        visitText = `Let's arrange your exclusive site walkthrough for ${factSheet.commercialName}! I am checking authentic free slots for you right now with zero double-booking. Please choose your preferred time below:`;
      }

      return {
        responseText: visitText,
        detectedIntent: 'REQUEST_VISIT',
        toolCallTriggered: 'check_available_slots',
        isFlaggedForAudit: false,
        shouldPromptBookingModal: true,
      };
    }

    // 4. RERA Certification Inquiry
    case 'ASK_RERA': {
      let reraText = '';
      if (language === 'gu') {
        reraText = `${factSheet.commercialName} એ ગુજરાત રેરા (GujRERA) હેઠળ સંપૂર્ણ પ્રમાણિત છે. સત્તાવાર રેરા નંબર: ${factSheet.reraNumber} છે. આ પ્રોજેક્ટ AUDA અને RERA ના તમામ ધોરણોનું પાલન કરે છે.`;
      } else if (language === 'hi') {
        reraText = `${factSheet.commercialName} गुजरात रेरा (GujRERA) के तहत पूरी तरह पंजीकृत है। आधिकारिक रेरा नंबर: ${factSheet.reraNumber} है। यह प्रोजेक्ट सभी स्वीकृत मानकों के अनुसार निर्मित हो रहा है।`;
      } else {
        reraText = `${factSheet.commercialName} is 100% compliant and registered under Gujarat RERA. Official GujRERA Registration Number: ${factSheet.reraNumber} (Valid until ${factSheet.reraValidUntil}). All specifications follow sanctioned AUDA plans.`;
      }

      return {
        responseText: reraText,
        detectedIntent: 'ASK_RERA',
        isFlaggedForAudit: false,
      };
    }

    // 5. Price Inquiry
    case 'ASK_PRICE': {
      const configSummary = factSheet.configurations
        .map((c) => `${c.type} (${c.carpetAreaSqFt}) at ${c.priceRange}`)
        .join(' | ');

      let priceText = '';
      if (language === 'gu') {
        priceText = `${factSheet.commercialName} માં કિંમત: ${configSummary}. આમાં ૧૦૦% કવર્ડ પાર્કિંગ અને ક્લબ સભ્યપદ શામેલ છે. શું તમે સાઇટ વિઝિટ કરીને સેમ્પલ ફ્લેટ જોવા માંગો છો?`;
      } else if (language === 'hi') {
        priceText = `${factSheet.commercialName} में मूल्य निर्धारण: ${configSummary}. इसमें आरक्षित कवर्ड पार्किंग शामिल है। क्या आप सैंपल फ्लैट देखने के लिए साइट विजिट शेड्यूल करना चाहेंगे?`;
      } else {
        priceText = `Pricing for ${factSheet.commercialName}: ${configSummary}. All units include reserved covered car parking and complete clubhouse access. Would you like to schedule a private site visit?`;
      }

      return {
        responseText: priceText,
        detectedIntent: 'ASK_PRICE',
        isFlaggedForAudit: false,
        shouldPromptBookingModal: true,
      };
    }

    // 6. Amenities
    case 'ASK_AMENITIES': {
      const amenitiesList = factSheet.amenities.slice(0, 5).join(', ');
      let amenText = '';
      if (language === 'gu') {
        amenText = `${factSheet.commercialName} માં વિશ્વસ્તરીય સુવિધાઓ છે, જેમ કે: ${amenitiesList}. શું તમે આ સુવિધાઓ રૂબરૂ જોવા માટે મુલાકાત બુક કરવા માંગો છો?`;
      } else if (language === 'hi') {
        amenText = `${factSheet.commercialName} में प्रीमियम सुविधाएं उपलब्ध हैं: ${amenitiesList}. क्या आप क्लबहाउस और सैंपल फ्लैट देखने के लिए विजिट बुक करना चाहेंगे?`;
      } else {
        amenText = `${factSheet.commercialName} features premier amenities including: ${amenitiesList}, and 24/7 3-tier security. Would you like to schedule a visit to experience the clubhouse?`;
      }

      return {
        responseText: amenText,
        detectedIntent: 'ASK_AMENITIES',
        isFlaggedForAudit: false,
        shouldPromptBookingModal: true,
      };
    }

    // 7. Location
    case 'ASK_LOCATION': {
      const landmarks = factSheet.location.nearbyLandmarks.slice(0, 3).join(', ');
      let locText = '';
      if (language === 'gu') {
        locText = `${factSheet.commercialName} ${factSheet.location.address} ખાતે આવેલું છે. નજીકના સીમાચિહ્નો: ${landmarks}. મુલાકાત બુક કરવા પર તમને સીધું ગૂગલ મેપ્સ પિન મળશે.`;
      } else if (language === 'hi') {
        locText = `${factSheet.commercialName} का पता है: ${factSheet.location.address}। नजदीकी स्थल: ${landmarks}। साइट विजिट बुक करने पर हम आपको गूगल मैप्स लोकेशन पिन भेजेंगे।`;
      } else {
        locText = `${factSheet.commercialName} is located at ${factSheet.location.address}. Prime connectivity: ${landmarks}. When you book a site visit, we provide an instant Google Maps location pin and directions.`;
      }

      return {
        responseText: locText,
        detectedIntent: 'ASK_LOCATION',
        isFlaggedForAudit: false,
      };
    }

    // 8. Possession
    case 'ASK_POSSESSION': {
      let possText = '';
      if (language === 'gu') {
        possText = `${factSheet.commercialName} માટે કબજો (Possession) ${factSheet.possessionDate} સુધીમાં સોંપવામાં આવશે. વર્તમાન બાંધકામ સ્થિતિ: ${factSheet.constructionStage}.`;
      } else if (language === 'hi') {
        possText = `${factSheet.commercialName} का पजेशन ${factSheet.possessionDate} में निर्धारित है। निर्माण प्रगति: ${factSheet.constructionStage}।`;
      } else {
        possText = `Possession for ${factSheet.commercialName} is slated for ${factSheet.possessionDate}. Construction update: ${factSheet.constructionStage}.`;
      }

      return {
        responseText: possText,
        detectedIntent: 'ASK_POSSESSION',
        isFlaggedForAudit: false,
      };
    }

    // 9. Greeting
    case 'GREETING': {
      let greetText = '';
      if (language === 'gu') {
        greetText = `નમસ્તે! હું ${factSheet.commercialName} નો સત્તાવાર AI સહાયક છું. હું તમને કાર્પેટ એરિયા, કિંમત, સુવિધાઓ વિશે વિગતો આપી શકું છું અથવા સાઇટ વિઝિટ બુક કરી શકું છું. તમે આજે શું જાણવા માંગો છો?`;
      } else if (language === 'hi') {
        greetText = `नमस्ते! मैं ${factSheet.commercialName} का आधिकारिक एआई सहायक हूँ। मैं आपको कारपेट एरिया, कीमत, सुविधाओं की जानकारी दे सकता हूँ या साइट विजिट बुक कर सकता हूँ। आप किस बारे में जानना चाहते हैं?`;
      } else {
        greetText = `Welcome! I am the verified AI concierge for ${factSheet.commercialName}. I can provide carpet areas, approved pricing bands, amenities, or reserve a conflict-free site visit slot for you. How can I help you today?`;
      }

      return {
        responseText: greetText,
        detectedIntent: 'GREETING',
        isFlaggedForAudit: false,
      };
    }

    // 10. Project Specs
    case 'ASK_PROJECT_SPECS': {
      const specs = factSheet.configurations
        .map((c) => `${c.type}: Carpet Area ${c.carpetAreaSqFt}, ${c.balconies} Balconies, ${c.bathrooms} Bathrooms`)
        .join(' | ');

      let specText = '';
      if (language === 'gu') {
        specText = `${factSheet.commercialName} પ્લાન્સ: ${specs}. ફ્લોરિંગ: ${factSheet.keySpecifications.flooring}. શું તમે સેમ્પલ ફ્લેટ જોવા માંગો છો?`;
      } else if (language === 'hi') {
        specText = `${factSheet.commercialName} यूनिट विनिर्देश: ${specs}। फ्लोरिंग: ${factSheet.keySpecifications.flooring}। क्या आप व्यक्तिगत दौरा बुक करना चाहेंगे?`;
      } else {
        specText = `${factSheet.commercialName} configurations: ${specs}. Premium finish: ${factSheet.keySpecifications.flooring}. Would you like to schedule an in-person tour?`;
      }

      return {
        responseText: specText,
        detectedIntent: 'ASK_PROJECT_SPECS',
        isFlaggedForAudit: false,
        shouldPromptBookingModal: true,
      };
    }

    // 11. Unknown / Off Fact Sheet Inquiry -> Missing Fact Boundary
    default: {
      return {
        responseText: t.missingFactNotice,
        detectedIntent: 'UNKNOWN_OFF_FACTSHEET',
        isFlaggedForAudit: true,
        flagReason: `User asked a question not covered by the approved Fact Sheet: "${query}"`,
        toolCallTriggered: 'escalate_to_executive',
      };
    }
  }
}
