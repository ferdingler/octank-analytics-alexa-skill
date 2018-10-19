const Alexa = require('ask-sdk-core');
const lodash = require('lodash');
const repo = require('./repo.js');

const reprompts = [
  'Can I help you with anything else?',
  'What else can I do for you?',
  'Is there anything else you want to know?',
];

const errors = [
  "Sorry, I didn't get that. I told you guys that doing a Live Demo was a bad idea",
];

const welcome = [
  'Welcome to Octank Analytics, how can I help you today?',
];

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log('handlerInput', handlerInput);
    const speechText = 'Welcome to Octank Analytics, how can I help you today?';
    return handlerInput.responseBuilder
      .speak(lodash.sample(welcome))
      .reprompt(speechText)
      .withSimpleCard('Octank Analytics', speechText)
      .getResponse();
  }
};

const BestSellerIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'BestSeller';
  },
  handle(handlerInput) {
    console.log('handlerInput', handlerInput);
    const speechText = "The best seller was the Nike Rainbow Shoes. Fun Fact: Those are Dominic's favorites";
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Best Seller', speechText)
      .reprompt(lodash.sample(reprompts))
      .getResponse();
  }
};

const TopProductsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TopProducts';
  },
  async handle(handlerInput) {
    console.log('handlerInput', handlerInput);
    const numberProducts = handlerInput.requestEnvelope.request.intent.slots.numberProducts;

    if (!numberProducts.value) {
      return handlerInput.responseBuilder
        .speak("hmm I didn't get that. I told you guys that doing a Live Demo was a bad idea")
        .withSimpleCard('Top Products', speechText)
        .reprompt(lodash.sample(reprompts))
        .getResponse();
    }

    const products = await repo.getTopProducts(numberProducts.value);
    const speechText = "The "
      .concat(numberProducts.value)
      .concat(' products that performed the best were ')
      .concat(products.join(','));

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Top Products', speechText)
      .reprompt(lodash.sample(reprompts))
      .getResponse();
  }
};

const SocialMediaStatusIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SocialMediaStatus';
  },
  async handle(handlerInput) {
    console.log('handlerInput', handlerInput);

    const socialMedia = await repo.getSocialMediaStatus();
    const speechText = "According to my latest data, there were a total of "
      .concat(socialMedia.total)
      .concat(" tweets; out of which ")
      .concat(socialMedia.negative)
      .concat(" were negative, ")
      .concat(socialMedia.positive)
      .concat(" were positive and ")
      .concat(socialMedia.neutral)
      .concat(" were neutral");

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Social Media Status', speechText)
      .reprompt(lodash.sample(reprompts))
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = "You can ask me about Octank on social media or sales information, to mention a few examples";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Help', speechText)
      .getResponse();
  }
};

const WebsiteVisitsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WebsiteVisits';
  },
  handle(handlerInput) {
    console.log('handlerInput', handlerInput);
    const dayOfWeek = handlerInput.requestEnvelope.request.intent.slots.visitorsTime;
    const visitors = lodash.random(343, 1200);
    let speechText = "On "
      .concat(dayOfWeek.value)
      .concat(", we got ")
      .concat(visitors)
      .concat(" visitors on the website. ");

    if (visitors > 500) {
      speechText = speechText.concat("It was a good day!");
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Website Visits', speechText)
      .reprompt(lodash.sample(reprompts))
      .getResponse();
  }
};

const OctankErrorHandler = {
  canHandle(handlerInput, error) {
    return error.name.startsWith('AskSdk');
  },
  handle(handlerInput, error) {
    return handlerInput.responseBuilder
      .speak(lodash.sample(errors))
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder.addRequestHandlers(
  LaunchRequestHandler,
  BestSellerIntentHandler,
  TopProductsIntentHandler,
  SocialMediaStatusIntentHandler,
  HelpIntentHandler,
  WebsiteVisitsIntentHandler,
).addErrorHandlers(
  OctankErrorHandler,
).lambda();
