import React, {Component} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import {withTranslation} from 'react-i18next';
import {compose} from 'redux';
import {
  initConnection,
  getProducts,
  purchaseErrorListener,
  purchaseUpdatedListener,
  flushFailedPurchasesCachedAsPendingAndroid,
  requestPurchase,
  PurchaseError,
  finishTransaction,
  getAvailablePurchases,
  endConnection,
} from 'react-native-iap';
import AppBackground from '../../components/AppBackground';
import Icons from '../../assets/Icons';
import {Colors, NavService} from '../../config';
import CustomButton from '../../components/CustomButton';
import {addCampaignGoals, createCampaign} from '../../redux/APIs';
import {loaderStop, loaderStart} from '../../redux/actions';

const productIds = Platform.select({
  ios: [
    'np_7days_1videoad',
    'np_15days_1videoad',
    'np_22days_1videoad',
    'np_30days_1videoad',
  ],
  android: [
    'np_7days_1videoad',
    'np_15days_1videoad',
    'np_22days_1videoad',
    'np_30days_1videoad',
  ],
});
class FeatureCampaign extends Component {
  state = {
    selectedPlan: null,
    selectedOffer: 0,
    offerToken: null,
    products: [],
  };

  async componentDidMount() {
    await initConnection();
    await this.getProducts();
    await this.purchase();
  }
  buyFeature = async (
    receiptJson,
    sku,
    title,
    finishTransaction,
    receipt,
    price,
  ) => {
    const currentApiPayload = this?.props?.route?.params?.payload;
    currentApiPayload['campaign_budget'] = price;
    currentApiPayload['package_type'] = title?.split(' ')[0];
    if (
      currentApiPayload?.customCampaignGoalValue &&
      currentApiPayload?.customCampaignGoalValue !== undefined
    ) {
      const addGoalPayload = {name: currentApiPayload?.customCampaignGoalValue};
      const newGoalId = await addCampaignGoals(addGoalPayload);
      currentApiPayload['goal_id'] = newGoalId;
    }
    delete currentApiPayload?.customCampaignGoalValue;
    await createCampaign(currentApiPayload, finishTransaction, receipt);
  };
  getProducts = async () => {
    loaderStart();
    try {
      const products = await getProducts({skus: productIds});
      this.setState({products});
    } catch (err) {
      console.warn(err);
    }
    loaderStop();
  };

  purchase = async () => {
    Platform.OS == 'android' &&
      (await flushFailedPurchasesCachedAsPendingAndroid());
    // flushFailedPurchasesCachedAsPendingAndroid()
    //   .then(() => {
    //     this.purchaseUpdateSubscription = purchaseUpdatedListener(
    //       async purchase => {
    //         const receipt = purchase.transactionReceipt;
    //         if (receipt) {
    //           console.log('purchase', purchase.productId);
    //           // await this.buyFeature(receipt, purchase.productId);
    //         }
    //         const newPurchase = await getAvailablePurchases();
    //         await finishTransaction(newPurchase[0]);
    //       },
    //     );

    //     this.purchaseErrorSubscription = purchaseErrorListener(error => {
    //       console.warn('purchaseErrorListener', error);
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  };

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    endConnection();
  }

  requestSubscription = async (sku, offerToken, title, price) => {
    try {
      loaderStart();

      const confirmationHandler = async () => {
        try {
          const receipt = await requestPurchase(
            Platform.select({
              ios: {
                sku,
                andDangerouslyFinishTransactionAutomaticallyIOS: false,
              },
              android: {
                skus: [sku],
              },
            }),
          );
          const receiptJson = JSON.stringify(receipt);
          // await finishTransaction({
          //   purchase: receipt,
          //   isConsumable: true,
          //   developerPayloadAndroid: undefined,
          // });
          await this.buyFeature(
            receiptJson,
            sku,
            title,
            finishTransaction,
            receipt,
            price,
          );

          loaderStop(); // Stop loader after purchase process
        } catch (error) {
          loaderStop(); // Ensure loader stops even if there's an error
          if (error instanceof PurchaseError) {
            console.log({
              message: `[${error?.code}]: ${error?.message}`,
              error,
            });
          } else {
            console.log({message: 'handleBuySubscription error', error});
          }
        }
      };

      Alert.alert(
        Platform.OS === 'android' ? 'Confirm Subscription' : 'Confirmation',
        Platform.OS === 'android'
          ? 'The Subscription will continue unless cancelled settings at least 24 hours before the end of the subscription period.'
          : 'Are you sure you want to continue the purchase',
        [
          {
            text: 'Cancel',
            onPress: () =>
              Toast.show({
                text1: 'Purchase cancelled',
                type: 'error',
                visibilityTime: 5000,
              }),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: confirmationHandler,
          },
        ],
      );
    } catch (error) {
      loaderStop();
      console.log({message: 'Unexpected error in buySubscription', error});
    }

    // try {
    //   loaderStart();
    //   Alert.alert(
    //     Platform.OS == 'android' ? 'Confirm Subscription' : 'Confirmation',
    //     Platform.OS == 'android'
    //       ? 'The Subscription will continue unless cancelled settings atleast 24 hours before the end of the subscription period.'
    //       : 'Are you sure you want to continue the purchase',
    //     [
    //       {
    //         text: 'Cancel',
    //         onPress: () =>
    //           Toast.show({
    //             text1: 'Purchased cancelled',
    //             type: 'error',
    //             visibilityTime: 5000,
    //           }),
    //         style: 'cancel',
    //       },
    //       {
    //         text: 'OK',
    //         onPress: async () => {
    //           const receipt = await requestPurchase(
    //             Platform.select({
    //               ios: {
    //                 sku,
    //                 andDangerouslyFinishTransactionAutomaticallyIOS: false,
    //               },
    //               android: {
    //                 skus: [sku],
    //               },
    //             }),
    //           );
    //           const receiptJson = JSON.stringify(receipt);
    //           // await finishTransaction({
    //           //   purchase: receipt[0],
    //           //   isConsumable: true,
    //           //   developerPayloadAndroid: undefined,
    //           // });
    //           await this.buyFeature(
    //             receiptJson,
    //             sku,
    //             title,
    //             finishTransaction,
    //             receipt,
    //           );
    //         },
    //       },
    //     ],
    //   );
    //   loaderStop();
    // } catch (error) {
    //   loaderStop();
    //   if (error instanceof PurchaseError) {
    //     console.log({message: `[${error?.code}]: ${error?.message}`, error});
    //   } else {
    //     console.log({message: 'handleBuySubscription', error});
    //   }
    // }
  };
  render() {
    const {user, t} = this.props;
    const {selectedPlan, products} = this.state;
    return (
      <AppBackground back title={t('str_Feature_Campaign')}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {products?.length > 0
            ? products?.map((item, index) => {
                return (
                  <React.Fragment key={index + 1}>
                    <Text style={styles.ads}>
                      {item?.description == '1 video ad promote for 7 days'
                        ? t('str_1_video_ad_promote_for_7_days')
                        : item?.description == '1 video ad promote for 30 days'
                        ? t('str_1_video_ad_promote_for_30_days')
                        : item?.description == '1 video ad promote for 15 days'
                        ? t('str_1_video_ad_promote_for_15_days')
                        : item?.description == '1 video ad promote for 22 days'
                        ? t('str_1_video_ad_promote_for_22_days')
                        : ''}
                    </Text>
                    <Text style={styles.dec}>
                      {t('str_reach_up_to_more_buyers')}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          this.setState({
                            selectedPlan: item,
                          });
                        }}
                        // disabled={user?.is_subscribed == 1 ? true : false}
                        style={
                          selectedPlan?.productId == item?.productId
                            ? styles.card1
                            : user?.sku == item?.productId
                            ? styles.card1
                            : styles.card
                        }>
                        <View
                          style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            paddingVertical: 14,
                          }}>
                          <TouchableOpacity activeOpacity={0.9}>
                            <Image
                              style={{
                                width: 22,
                                height: 22,
                                tintColor:
                                  selectedPlan?.productId == item?.productId
                                    ? Colors.primary
                                    : user?.sku == item?.productId
                                    ? Colors.primary
                                    : '#000',
                              }}
                              source={
                                selectedPlan?.productId == item?.productId
                                  ? Icons.checktrue
                                  : user?.sku == item?.productId
                                  ? Icons.checktrue
                                  : Icons.check
                              }
                            />
                          </TouchableOpacity>

                          <Text
                            style={
                              selectedPlan?.productId == item?.productId
                                ? {
                                    paddingLeft: 20,
                                    color: Colors.primary,
                                    fontWeight: '600',
                                    fontSize: 16,
                                  }
                                : user?.sku == item?.productId
                                ? {
                                    paddingLeft: 20,
                                    color: Colors.primary,
                                    fontWeight: '600',
                                    fontSize: 16,
                                  }
                                : {
                                    paddingLeft: 20,
                                    color: Colors.black,
                                    fontWeight: '600',
                                    fontSize: 16,
                                  }
                            }>
                            {Platform.OS == 'ios'
                              ? item?.title == '30 Days'
                                ? t('str_30_days')
                                : item?.title == '15 Days'
                                ? t('str_15_days')
                                : item?.title == '22 Days'
                                ? t('str_22_days')
                                : item?.title == '7 Days'
                                ? t('str_7_days')
                                : item?.title == '15 Days'
                                ? t('str_15_days')
                                : item?.title == '1 Day'
                                ? t('str_7_days')
                                : t('str_1_days')
                              : String(item?.title).slice(0, 7) == '30 Days'
                              ? `${t('str_30_days')} ${String(
                                  item?.title,
                                ).slice(7)}`
                              : String(item?.title).slice(0, 7) == '15 Days'
                              ? `${t('str_15_days')} ${String(
                                  item?.title,
                                ).slice(7)}`
                              : String(item?.title).slice(0, 7) == '22 Days'
                              ? `${t('str_22_days')} ${String(
                                  item?.title,
                                ).slice(7)}`
                              : String(item?.title).slice(0, 7) == '7 Days '
                              ? `${t('str_7_days')} ${String(item?.title).slice(
                                  7,
                                )}`
                              : item?.title}
                          </Text>
                        </View>
                        <View
                          style={
                            selectedPlan?.productId == item?.productId
                              ? styles.row1
                              : user?.sku == item?.productId
                              ? styles.row1
                              : styles.row
                          }>
                          <Text
                            style={
                              selectedPlan?.productId == item?.productId
                                ? {
                                    color: Colors.primary,
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                  }
                                : user?.sku == item?.productId
                                ? {
                                    color: Colors.primary,
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                  }
                                : {
                                    color: Colors.black,
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                  }
                            }>
                            {item?.localizedPrice
                              ? item?.localizedPrice
                              : `${item?.price}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </React.Fragment>
                );
              })
            : null}
          <View
            style={{
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <CustomButton
              onPress={() => {
                selectedPlan !== null
                  ? this.requestSubscription(
                      selectedPlan?.productId,
                      null,
                      selectedPlan?.title,
                      selectedPlan?.price,
                    )
                  : Toast.show({
                      text1: 'Please select a subscription plan',
                      type: 'error',
                      visibilityTime: 5000,
                    });
              }}
              title={'Buy'}
            />
          </View>
        </ScrollView>
      </AppBackground>
    );
  }
}
function mapState({user: {userData}}) {
  return {
    user: userData,
  };
}
export default compose(
  withTranslation(),
  connect(mapState, null),
)(FeatureCampaign);

const styles = StyleSheet.create({
  ads: {
    color: Colors.black,
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dec: {
    color: Colors.black,
    fontSize: 15,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.black,
    width: '100%',
    marginVertical: 12,
    borderRadius: 6,
    alignSelf: 'center',
  },
  card1: {
    borderWidth: 1,
    borderColor: Colors.primary,
    width: '100%',
    marginVertical: 12,
    borderRadius: 6,
    alignSelf: 'center',
  },
  row: {
    paddingVertical: 12,
    alignItems: 'center',
    borderColor: Colors.black,
    borderTopWidth: 1,
  },
  row1: {
    paddingVertical: 12,
    alignItems: 'center',
    borderColor: Colors.primary,
    borderTopWidth: 1,
  },
});
