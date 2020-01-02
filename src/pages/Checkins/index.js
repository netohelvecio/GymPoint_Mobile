import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
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
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [page, setPage] = useState(1);

  const id = useSelector(state => state.auth.id);

  useEffect(() => {
    async function loadCheckins() {
      try {
        if (page === 1) {
          setLoading(true);
        }

        const response = await api.get(`students/${id}/checkins`, {
          params: {
            page,
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

        if (page >= 2) {
          const newData = checkins.concat(data);
          setCheckins(newData);
        } else {
          setCheckins(data);
        }

        setLoading(false);
      } catch (error) {
        Alert.alert('Erro!', 'Erro ao listar checkins');
        setLoading(false);
      }
    }

    loadCheckins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  async function handleCheckin() {
    try {
      setLoadingSubmit(true);
      await api.post(`students/${id}/checkins`);

      Alert.alert('Checkin realizado!');
      setLoadingSubmit(false);
    } catch (error) {
      Alert.alert(
        'Erro ao realizar checkin!',
        'Número de checkin (5 checkins nos últimos 7 dias) atigiu o limite'
      );
      setLoadingSubmit(false);
    }
  }

  async function loadMore() {
    setPage(page + 1);
  }

  return (
    <>
      <Header />

      <Container>
        <CheckinButton onPress={handleCheckin}>
          {loadingSubmit ? (
            <ActivityIndicator color="#fff" size={24} />
          ) : (
            <CheckinButtonText>Novo check-in </CheckinButtonText>
          )}
        </CheckinButton>

        {loading ? (
          <Loading />
        ) : (
          <CheckinList
            data={checkins}
            keyExtractor={item => item.id.toString()}
            onEndReachedThreshold={0.2}
            onEndReached={loadMore}
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
