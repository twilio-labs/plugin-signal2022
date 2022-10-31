import React from 'react';
import { TWILIO_LARGE } from '../../utils/asciiLogos';
import { Image } from './Image';

export function TwilioLogo() {
  return <Image imageString={TWILIO_LARGE} color="redBright" />;
}
