import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  Platform,
  UIManager,
  Keyboard,
  LayoutAnimation,
  FlatList,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import AppBackground from '../../components/AppBackground';
import CustomButton from '../../components/CustomButton';
import Colors from '../../config/colors';
import { Shadows, Devices } from '../../config';
import Icons from '../../assets/Icons';
import { loaderStart, loaderStop, productOffergiven } from '../../redux/actions';
import URL from '../../config/Common';
import { getUrl } from '../../config/Helpers/getUrl';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const { width } = Dimensions.get('window');

// const selectedAmount = [1000, 2000, 3000, 4000, 5000];

const Chat = ({ route, navigation }) => {
  const dataOfItems = route.params;
  const refRBSheet = useRef();
  const { t } = useTranslation();

  const user_id = useSelector(state => state.user?.userData?._id);
  const productId_afterOffer = useSelector(state => state.user?.productOffer);
  const insets = useSafeAreaInsets();

  const socket = useSelector(state => state.socket);
  // var sender_id = dataOfItems?.sender_id==user_id ? user_id : receiver_id;
  // var receiver_id =  dataOfItems?.receiver_id==user_id ? receiver_id : user_id;
  const sender_id = user_id;
  const receiver_id = dataOfItems?.details?.receiver_id;
  const product_id = dataOfItems?.details?.product_id;
  const product_price = dataOfItems?.details?.product_price;
  const product_title = dataOfItems?.details?.product_title;
  const product_picture = dataOfItems?.details?.product_picture[0];
  const [chatList, setChatList] = useState([]);
  const [MessageIncoming, setMessageIncoming] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState();
  const [hide, setHide] = useState(false);
  const [messages, setMessages] = useState('');
  const [selectedAmount, setselectedAmount] = useState([]);
  const [addOffer, setAddOffer] = useState(false);

  const MathFunction = () => {
    let selectedAmounts = [];
    for (var i = 0; i < 5; i++) {
      var RandomNumber = Math.ceil(Math.random() * product_price) + 10;

      selectedAmounts.push(RandomNumber);
      setselectedAmount(selectedAmounts);
    }
  };

  const response = () => {
    socket?.emit('get_messages', { sender_id, receiver_id, product_id });
    socket?.on('response', data => {
      if (data?.message?.length == 0) {
        loaderStop();
        return;
      }
      if (data?.object_type == 'get_messages') {
        const messages = data?.data || [];
        messages.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const uniqueMessages = messages.filter((item, index, self) => self.findIndex(i => i._id === item._id) === index);
        setChatList(() => uniqueMessages);
      } else {
        const newMessages = data?.data.filter((item, index, self) => self.findIndex(i => i._id === item._id) === index);
        setChatList(chatList1 => [...newMessages, ...chatList1.filter((item, index, self) => self.findIndex(i => i._id === item._id) === index)]);
      }
      loaderStop();
    });
    socket.on('error', data => {
      loaderStop();
    });
  };
  const sendNewMessage = async () => {
    if (messages.length > 0) {
      loaderStart();
      const data = {
        sender_id,
        receiver_id,
        message: messages,
        product_id,
      };
      socket.emit('send_message', data);
      setMessages('');
    } else {
      Toast.show({
        text1: `${t('Enter_message')}`,
        type: 'error',
        visibilityTime: 3000,
      });
    }
  };

  const sendNewOffer = async () => {
    loaderStart();
    const data = {
      sender_id,
      receiver_id,
      message: `We_are_sending_you_an_Offer_of $${selectedPrice}`,

      product_id,
    };
    socket.emit('send_message', data);
    productOffergiven(product_id);
  };
  // const get = async () => {
  //   const resulte = await getProducts();
  //   for (var i = 0; i < resulte?.length; i++) {

  //     if (resulte[i]?.seller == sender_id)
  //     setproductIdMatched(true);
  //   }
  // };
  useEffect(() => {
    // loaderStart();
    MathFunction();
    loaderStart();
    response();
    socket?.emit('mark_as_read', { sender_id, receiver_id, product_id });
    // get();
  }, []);
console.log(product_picture, "product_pictureproduct_picture")
  const ListHeaderComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: Colors.white,
          ...Shadows.shadow5,
          height: 75,
          borderRadius: 40,
          alignItems: 'center',
          paddingHorizontal: '9%',
          marginTop: 10,
        }}>
        <View
          style={{
            height: 48,
            width: 48,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary,
            borderRadius: 25,
            marginRight: -20,
          }}>
          <Image
            source={{ uri: getUrl(product_picture) }}
            style={{
              height: 48,
              width: 48,
              borderRadius: 25,
            }}
          />
        </View>
        <Text
          style={{
            color: Colors.black,
            fontSize: 16,
            fontWeight: '700',
          }}>
          {String(product_title)?.slice(0, 5) + '...'}
        </Text>
        <Text
          style={{
            color: Colors.black,
            fontSize: 16,
            fontWeight: '700',
          }}>
          ${product_price}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => refRBSheet.current.open()}>
          <Text
            style={{
              color: Colors.primary,
              fontSize: 16,
              fontWeight: '700',
              textDecorationLine: 'underline',
            }}>
            {t('Make_Offer')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  useEffect(() => {
    const keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.linear();
        setKeyboardShown(true);
      },
    );
    const keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.linear();
        setKeyboardShown(false);
      },
    );
    return () => {
      keyboardDidShowSubscription.remove();
      keyboardDidHideSubscription.remove();
      setKeyboardShown(false);
    };
  }, []);

  return (
    <AppBackground
      back
      title={dataOfItems?.details?.user_title}
      notification={false}>
      {hide
        ? null
        : dataOfItems?.notOffer
          ? null
          : productId_afterOffer == product_id
            ? null
            : dataOfItems?.offered == true
              ? null
              : ListHeaderComponent()}
      <FlatList
        data={[...chatList]}
        inverted
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginBottom: 10 }}
        ListEmptyComponent={() => (
          <View
            style={{
              marginVertical: '80%',
              transform: [{ scaleY: -1 }],
              alignItems: 'center',
              alignSelf: 'center',
              alignContent: 'center',
            }}>
            <Text style={{ color: 'black' }}>{t('No_chat_found')}</Text>
          </View>
        )}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 30,
          paddingHorizontal: 3,
          marginHorizontal: 20,
        }}
        renderItem={({ item }) => <MessageList item={item} />}
        key={MessageIncoming}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        style={[
          {
            height: 65,
            width: width * 0.93,
            marginBottom: 10 + insets.bottom,
            backgroundColor: Colors.white,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            paddingBottom: Devices.isIphoneX ? 15 : 0,
            paddingVertical: 15,
            paddingHorizontal: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...Shadows.shadow5,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          },
        ]}>
        <TextInput
          onChangeText={value => setMessages(value)}
          value={messages}
          placeholder={t('Write_your_message_here')}
          placeholderTextColor={Colors.grey}
          style={{
            flex: 1,
            height: '100%',
            color: Colors.black,
            marginBottom: 10,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            sendNewMessage();
          }}
          style={{
            height: 48,
            width: 48,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary,
            borderRadius: 24,
            marginRight: -20,
            marginBottom: 10,
          }}>
          <Image
            source={Icons.send}
            style={{
              height: 28,
              width: 28,
              tintColor: 'white',
            }}
          />
        </TouchableOpacity>
      </View>
      <RBSheet
        ref={refRBSheet}
        height={250}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}>
        <View style={{ paddingHorizontal: 30 }}>
          {/* <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}> */}
          {!addOffer && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedAmount?.map((price, index) => {
                return (
                  <TouchableOpacity
                    key={index + 1}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor:
                        selectedPrice == price
                          ? Colors.primary
                          : Colors.lightGrey,
                      marginHorizontal: 5,
                      marginVertical: 5,
                      borderRadius: 15,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}
                    onPress={() => setSelectedPrice(price)}>
                    <Text>${price}</Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() => setAddOffer(!addOffer)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: Colors.primary,
                  marginHorizontal: 5,
                  marginVertical: 5,
                  borderRadius: 15,
                  paddingHorizontal: 30,
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingVertical: 4,
                }}>
                <Text style={{ color: 'white', fontSize: 22, fontWeight: '800' }}>
                  +
                </Text>
              </TouchableOpacity>
              {/* </View> */}
            </ScrollView>
          )}

          {addOffer && (
            <View style={{ width: '100%' }}>
              <TouchableOpacity onPress={() => setAddOffer(!addOffer)}>
                <Image
                  source={Icons.back}
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                />
              </TouchableOpacity>

              <TextInput
                maxLength={7}
                value={selectedPrice ? String(selectedPrice) : ''}
                onChangeText={text => setSelectedPrice(text)}
                keyboardType="numeric"
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                  width: '100%',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'grey',
                  height: 55,
                  fontSize: 24,
                  fontWeight: '500',
                }}
                placeholder="Price"
              />
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            {/* <Text style={{ color: '#000', fontSize: 32 }}>
              {selectedPrice ? `$${selectedPrice}` : null}
            </Text> */}
            <CustomButton
              title={t('SEND')}
              onPress={() => {
                refRBSheet.current.close();
                sendNewOffer();
                setHide(true);
                setAddOffer(!addOffer);
              }}
              buttonStyle={{
                width: width - 280,
              }}
            />
          </View>
        </View>
      </RBSheet>
    </AppBackground>
  );
};

export default Chat;

const MessageList = ({ item }) => {
  const { message, createdAt } = item;
  const myData = useSelector(state => state.user?.userData);
  const isMine = myData?._id == item?.sender_id?._id;

  return (
    <View
      style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', marginTop: 12 }}>
      <View
        style={{
          backgroundColor: isMine ? Colors.primary : Colors.white,
          padding: 16,
          borderRadius: 30,
          marginTop: 16,
          ...Shadows.shadow5,
        }}>
        <Text
          style={{
            color: isMine ? Colors.white : Colors.black,
            fontSize: 15,
            fontWeight: '500',
          }}>
          {message}
        </Text>
      </View>
      <Text
        style={{
          marginTop: 7,
          alignSelf: 'flex-end',
          color: Colors.grey,
          fontWeight: '400',
          fontSize: 11,
          paddingRight: 4,
        }}>
        {moment(createdAt).format('YYYY-MM-DD')}
      </Text>
    </View>
  );
};
