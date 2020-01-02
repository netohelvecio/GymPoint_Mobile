import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
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
  HelpButton,
  HelpButtonText,
  HelpList,
  Help,
  HelpHeader,
  ContainerAnswer,
  CheckAnswer,
  HelpTime,
  HelpQuestion,
} from './styles';

export default function HelpOrders() {
  const [helps, setHelps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [page, setPage] = useState(1);

  const id = useSelector(state => state.auth.id);

  useEffect(() => {
    async function loadHelpOrders() {
      try {
        if (page === 1) {
          setLoading(true);
        }

        const response = await api.get(`students/${id}/help-orders`, {
          params: {
            page,
          },
        });

        const data = response.data.map(help => ({
          ...help,
          timeFormatted: formatDistanceToNow(parseISO(help.updated_at), {
            locale: pt,
            addSuffix: true,
          }),
        }));

        if (page >= 2) {
          const newData = helps.concat(data);
          setHelps(newData);
        } else {
          setHelps(data);
        }

        setLoading(false);
      } catch (error) {
        Alert.alert('Erro!', 'Erro ao listar perguntas');
        setLoading(false);
      }
    }

    loadHelpOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  async function loadMore() {
    setPage(page + 1);
  }

  return (
    <>
      <Header />

      <Container>
        <HelpButton onPress={() => {}}>
          {loadingSubmit ? (
            <ActivityIndicator color="#fff" size={24} />
          ) : (
            <HelpButtonText>Novo check-in </HelpButtonText>
          )}
        </HelpButton>

        {loading ? (
          <Loading />
        ) : (
          <HelpList
            data={helps}
            keyExtractor={item => item.id.toString()}
            onEndReachedThreshold={0.2}
            onEndReached={loadMore}
            renderItem={({ item }) => (
              <Help>
                <HelpHeader>
                  <ContainerAnswer>
                    <Icon
                      name="check"
                      size={16}
                      color={item.answer ? '#42cb58' : '#999'}
                    />
                    <CheckAnswer answer={item.answer}>
                      {item.answer ? 'Respondido' : 'Não respondido'}
                    </CheckAnswer>
                  </ContainerAnswer>

                  <HelpTime>{item.timeFormatted}</HelpTime>
                </HelpHeader>

                <HelpQuestion>{item.question}</HelpQuestion>
              </Help>
            )}
          />
        )}
      </Container>
    </>
  );
}

HelpOrders.navigationOptions = {
  tabBarLabel: 'Pedir ajuda',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="live_help" size={25} color={tintColor} />
  ),
};
