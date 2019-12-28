import React from 'react';
import { Image } from 'react-native';

import logo from '~/assets/logo.png';
import { Container, Input, SubmitButton, SubmitButtonText } from './styles';

export default function SignIn() {
  return (
    <Container>
      <Image source={logo} />

      <Input
        placeholder="Informe seu ID de cadastro"
        returnKeyType="send"
        onSubmitEditing={() => {}}
        keyboardType="numeric"
      />

      <SubmitButton onPress={() => {}}>
        <SubmitButtonText>Entrar no sistema</SubmitButtonText>
      </SubmitButton>
    </Container>
  );
}
