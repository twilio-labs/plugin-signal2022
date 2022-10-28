/* eslint-disable prettier/prettier */
import { Text } from 'ink';
import React from 'react';
import { Session } from '../../../../types/session';
import { SignalTvTag } from './SignalTvTag';
import { ApacTag } from './ApacTag';
import { IndustryTag, ProductTag, VenturesTag } from './BoothTags';

export type SessionTags = {
  session: Session;
};
export function SessionTags({ session }: SessionTags) {
  const signalTv = session.type === 'SIGNAL TV';
  const apac = session.region === 'APAC';

  const generateBoothType = (type) => {
    if (type.indexOf('Booth') === -1) {
      return false;
    }

    if (type.indexOf('Venture') > -1) {
      return <VenturesTag />;
    }
    
    if (type.indexOf('Product') > -1) {
      return <ProductTag />;
    }
    if (type.indexOf('Industry') > -1) {
        return <IndustryTag />
    }
  };

  return (
    <Text>
      {apac && <ApacTag />}
      {generateBoothType(session.type)}
    </Text>
  );
}
