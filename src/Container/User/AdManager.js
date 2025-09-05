import {
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import AppBackground from '../../components/AppBackground';
import AdViewCard from '../../components/AdViewCard';
import { useTranslation } from 'react-i18next';
import { Shadows, NavService, Colors } from '../../config';
import Icons from '../../assets/Icons';
import { getCampaigns, deleteCampaign } from '../../redux/APIs';

const { width, height } = Dimensions.get('screen');

const AdManager = ({ navigation }) => {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [dataKey, setDataKey] = useState(false);
  const [selectedCampaignForDeletion, setSelectedCampaignForDeletion] =
    useState(null);
  const [deleteCampaignPopupVisibility, setdeleteCampaignPopupVisibility] =
    useState(false);
  const { t } = useTranslation();
  const getAllAdCampaigns = async () => {
    const allCampaigns = await getCampaigns('my');
    console.log('allCampaigns', allCampaigns);
    setAllCampaigns(allCampaigns);
  };
  const toggleDeleteCampaignPopupVisibilityPopup = () => {
    setdeleteCampaignPopupVisibility(!deleteCampaignPopupVisibility);
  };
  const deleteCampaignSelection = campaign => {
    setSelectedCampaignForDeletion(campaign);
    setdeleteCampaignPopupVisibility(true);
  };
  useEffect(() => {
    const focusListner = navigation.addListener('focus', async () => {
      await getAllAdCampaigns();
    });
    return focusListner;
  }, []);
  return (
    <AppBackground
      back
      marginHorizontal
      title={t('str_Ads_Manager')}
      notification={false}>
      <FlatList
        data={allCampaigns}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={({ item, index }) => (
          <AdViewCard
            info={item}
            onEditPress={() =>
              NavService.navigate('EditAd', { currentCampaign: item })
            }
            onDeletePress={deleteCampaignSelection}
          />
        )}
        keyExtractor={(item, index) => item?._id?.toString()}
        key={dataKey}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          right: 22,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            NavService.navigate('CreateAd');
          }}
          style={{
            backgroundColor: 'white',
            height: height * 0.07,
            width: width * 0.14,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadows.shadow5,
          }}>
          <Image
            style={{
              height: height * 0.04,
              width: width * 0.07,
              resizeMode: 'contain',
            }}
            source={Icons.plus}
          />
        </TouchableOpacity>
        <Text style={{ marginVertical: 4 }}>{t('Add')}</Text>
      </View>
      <Modal
        isVisible={deleteCampaignPopupVisibility}
        backdropOpacity={0.8}
        onBackButtonPress={() => toggleDeleteCampaignPopupVisibilityPopup()}
        onBackdropPress={() => toggleDeleteCampaignPopupVisibilityPopup()}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // paddingHorizontal: 20,
          }}>
          <View
            style={{
              width: '100%',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: Colors.border,
              backgroundColor: Colors.white,
            }}>
            <View
              style={{
                // backgroundColor: Colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                height: 65,
                width: '101%',
                marginLeft: -1,
                marginTop: -1,
              }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 20,
                  fontWeight: '700',
                }}>
                {t('str_CONFIRMATION')}
              </Text>
            </View>
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                {t('str_You_have_previously_deleted_your_account')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  height: 50,
                  width: '100%',
                  marginTop: 25,
                }}>
                <TouchableOpacity
                  onPress={() => toggleDeleteCampaignPopupVisibilityPopup()}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.offWhite,
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: Colors.white,
                      textTransform: 'uppercase',
                    }}>
                    {t('Cancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    toggleDeleteCampaignPopupVisibilityPopup();
                    await deleteCampaign(
                      selectedCampaignForDeletion?._id,
                      setSelectedCampaignForDeletion,
                      allCampaigns,
                      setAllCampaigns,
                      setDataKey,
                    );
                  }}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.primary,
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: Colors.white,
                      textTransform: 'uppercase',
                    }}>
                    {t('Delete')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </AppBackground>
  );
};

export default AdManager;

const styles = StyleSheet.create({});
