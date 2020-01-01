import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';
import Header from '~/components/Header';
import Loading from '~/components/Loading';

import {
  Container,
  CheckinButton,
  CheckinButtonText,
  CheckinList,
  Checkin,
  CheckinNumber,
  CheckinTime,
} from './styles';

export default function Checkins() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);

  const id = useSelector(state => state.auth.id);

  useEffect(() => {
    async function loadCheckins() {
      try {
        setLoading(true);

        const response = await api.get(`students/${id}/checkins`, {
          params: {
            page: 1,
          },
        });

        const data = response.data.map(checkin => ({
          ...checkin,
          checkinNumber: `Check-in #${checkin.id}`,
          timeFormatted: formatDistanceToNow(parseISO(checkin.created_at), {
            locale: pt,
            addSuffix: true,
          }),
        }));

        setCheckins(data);
        setLoading(false);
      } catch (error) {
        Alert.alert('Erro!', 'Erro ao listar checkins');
        setLoading(false);
      }
    }

    loadCheckins();
  }, [id]);

  async function handleCheckin() {
    try {
      await api.post(`students/${id}/checkins`);

      Alert.alert('Checkin realizado!');
    } catch (error) {
      Alert.alert(
        'Erro ao realizar checkin!',
        'Número de checkin (5 checkins nos últimos 7 dias) atigiu o limite'
      );
    }
  }

  return (
    <>
      <Header />

      <Container>
        <CheckinButton onPress={handleCheckin}>
          <CheckinButtonText>Novo check-in</CheckinButtonText>
        </CheckinButton>

        {loading ? (
          <Loading />
        ) : (
          <CheckinList
            data={checkins}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Checkin>
                <CheckinNumber>{item.checkinNumber}</CheckinNumber>
                <CheckinTime>{item.timeFormatted}</CheckinTime>
              </Checkin>
            )}
          />
        )}
      </Container>
    </>
  );
}

Checkins.navigationOptions = {
  tabBarLabel: 'Check-ins',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="beenhere" size={25} color={tintColor} />
  ),
};
