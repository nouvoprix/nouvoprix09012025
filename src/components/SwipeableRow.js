import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import {SwipeRow} from 'react-native-swipe-list-view';
import Icons from '../assets/Icons';
import {Colors} from '../config';
import {productDelete} from '../redux/APIs';
import {t} from 'i18next';

function SwipeableRow({
  item,
  renderVisibleComponent = () => {},
  height,
  onDelete = () => {},
  deleteProduct = true,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <SwipeRow
      // stopLeftSwipe={true}
      disableRightSwipe
      rightOpenValue={-80}
      onSwipeValueChange={e => {
        if (e.value < -70) {
          setVisible(true);
        } else if (e.value > -10) setVisible(false);
      }}>
      {renderHiddenComponent({item, visible, height, onDelete, deleteProduct})}
      {renderVisibleComponent(item)}
    </SwipeRow>
  );
}
export default SwipeableRow;
function DeleteButton({item, onDelete, deleteProduct}) {
  return (
    <View
      style={{
        marginVertical: 10,
        height: 60,
        // backgroundColor: 'red',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 50,
      }}>
      <TouchableOpacity
        onPress={async () => {
          if (deleteProduct) {
            await productDelete(item);
          }
          await onDelete();
        }}
        activeOpacity={0.9}
        style={{
          padding: 10,
          borderRadius: 30,
          backgroundColor: 'red',
        }}>
        <Image
          source={Icons.trash}
          style={{
            width: 25,
            height: 25,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 11,
          color: 'black',
          marginVertical: 2,
          textAlign: 'center',
          marginRight: 5,
        }}>
        {t('Delete')}
      </Text>
    </View>
  );
}
function renderHiddenComponent({
  item,
  visible,
  height = 150,
  onDelete,
  deleteProduct,
}) {
  if (!visible) return <View></View>;
  return (
    <View
      style={{
        height,
        justifyContent: 'center',
        marginRight: 14,
      }}>
      <DeleteButton
        item={item?._id}
        onDelete={onDelete}
        deleteProduct={deleteProduct}
      />
    </View>
  );
}
// white_check_mark;
// eyes;
// raised_hands;
