import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, NavService} from '../config';
import Icons from '../assets/Icons';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';

const CustomSelector = () => {
  const [fouced, setFouced] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [qty, setQty] = useState(null);
  const [price, setPrice] = useState("$");
  const [description, setDescription] = useState('');
  // const [image, setImage] = useState();
  const [imageUri, setImageuri] = useState('');
  const [imageUri1, setImageuri1] = useState('');
  const [imageUri2, setImageuri2] = useState('');
  const [imageUri3, setImageuri3] = useState('');
  const [imageType, setImageType] = useState('');
  const actionSheetRef = React.useRef(null);
  const actionSheetRef1 = React.useRef(null);
  const actionSheetRef2 = React.useRef(null);
  const actionSheetRef3 = React.useRef(null);

  const imageChange = (method = 'gallery') => {
    if (method === 'camera') {
      ImageCropPicker.openCamera({
        mediaType: 'photo',
      }).then(image => {
        setImageuri(image.path);
        setImageType(image.mime);
        actionSheetRef.current.hide();
      });
    } else {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
      }).then(image => {
        setImageuri(image.path);
        setImageType(image.mime);
        actionSheetRef.current.hide();
      });
    }
  };
  const imageAds1 = (method = 'gallery') => {
    if (method === 'camera') {
      ImageCropPicker.openCamera({
        mediaType: 'photo',
      }).then(image => {
        setImageuri1(image.path);
        setImageType(image.mime);
        actionSheetRef1.current.hide();
      });
    } else {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
      }).then(image => {
        setImageuri1(image.path);
        setImageType(image.mime);
        actionSheetRef1.current.hide();
      });
    }
  };
  const imageAds2 = (method = 'gallery') => {
    if (method === 'camera') {
      ImageCropPicker.openCamera({
        mediaType: 'photo',
      }).then(image => {
        setImageuri2(image.path);
        setImageType(image.mime);
        actionSheetRef2.current.hide();
      });
    } else {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
      }).then(image => {
        setImageuri2(image.path);
        setImageType(image.mime);
        actionSheetRef2.current.hide();
      });
    }
  };
  const imageAds3 = (method = 'gallery') => {
    if (method === 'camera') {
      ImageCropPicker.openCamera({
        mediaType: 'photo',
      }).then(image => {
        setImageuri3(image.path);
        setImageType(image.mime);
        actionSheetRef3.current.hide();
      });
    } else {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
      }).then(image => {
        setImageuri3(image.path);
        setImageType(image.mime);
        actionSheetRef3.current.hide();
      });
    }
  };
  return (
    <>
      <View
        style={{
          backgroundColor: Colors.white,
          width: Dimensions.get('window').width * 0.9,
          marginVertical: '8%',
          height: 48,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: 5,
        }}>
        <ActionSheet
          ref={actionSheetRef}
          containerStyle={{backgroundColor: 'transparent'}}>
          <View style={{padding: 10}}>
            <View
              style={{
                backgroundColor: 'rgba(241,241,241,0.8)',
                borderRadius: 10,
                marginBottom: 10,
              }}>
              <View
                style={{
                  borderBottomWidth: 1.5,
                  borderBottomColor: '#ccc',
                  paddingVertical: 10,
                }}>
                <Text style={{color: 'grey', textAlign: 'center'}}>
                  Choose an option to pick an Image
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  actionSheetRef.current.hide();
                  imageChange('camera');
                }}
                style={{
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderBottomWidth: 1.5,
                  borderBottomColor: '#ccc',
                }}>
                <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  imageChange('gallery');
                }}
                style={{paddingVertical: 12, alignItems: 'center'}}>
                <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                  Choose from Library
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => actionSheetRef.current.hide()}
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'rgb(0,88,200)',
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
        <TouchableOpacity
          onPress={() => {
            setFouced(true);
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: fouced ? Colors.secondary : 'transparent',
            height: '86%',
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 18,
              color: fouced ? Colors.white : Colors.grey,
              fontWeight: 'bold',
            }}>
            Product
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFouced(false);
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: !fouced ? Colors.secondary : 'transparent',
            height: '86%',
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 18,
              color: !fouced ? Colors.white : Colors.grey,
              fontWeight: 'bold',
            }}>
            Ads
          </Text>
        </TouchableOpacity>
      </View>
      {fouced && (
        <>
          <Text
            style={{
              color: Colors.grey,
              fontSize: 22,
              fontWeight: 'bold',
              paddingRight: 220,
            }}>
            Set Details
          </Text>
          {imageUri ? (
            <>
              <Image
                style={{
                  width: 340,
                  height: 200,
                  marginVertical: '8%',
                  borderRadius: 20,
                }}
                source={{uri: imageUri}}
              />
              <TouchableOpacity
                onPress={() => {
                  setImageuri(null);
                }}
                style={{
                  position: 'absolute',
                  left: 300,
                  top: 150,
                }}>
                <Text
                  style={{
                    fontSize: 34,
                    fontWeight: 'bold',
                    color: 'red',
                  }}>
                  x
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => actionSheetRef.current.show()}
              style={{
                backgroundColor: Colors.grey,
                width: 340,
                height: 200,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: '8%',
                borderRadius: 20,
              }}>
              <Image
                source={Icons.uploadBtn}
                style={{
                  height: 50,
                  width: 50,
                  tintColor: Colors.white,
                }}
              />
            </TouchableOpacity>
          )}
          <View
            style={{
              marginTop: -14,
            }}>
            <CustomTextInput
              value={title}
              onChangeText={text => setTitle(text)}
              label={'Title'}
            />
            <CustomTextInput
              value={category}
              onChangeText={text => setCategory(text)}
              label={'Category'}
            />
            <CustomTextInput
              value={qty}
              onChangeText={text => setQty(text)}
              label={'Quantity'}
              keyboardType={"numeric"}
            />
            <CustomTextInput
              value={price}
              onChangeText={text => setPrice(text)}
              label={'Price'}
              keyboardType={'numeric'}
            />
            <CustomTextInput
              value={description}
              onChangeText={text => setDescription(text)}
              label={'Description'}
            />
          </View>
         <View style={{
          width:"100%",
          alignItems:"center",
          marginVertical: 28
         }} >
         <CustomButton
            onPress={() => {
              NavService.reset(0,[{name: "GuardianAppStack"}])
            }}
            title="Post"
          />
         </View>
        </>
      )}
      {!fouced && (
        <>
          <ActionSheet
            ref={actionSheetRef1}
            containerStyle={{backgroundColor: 'transparent'}}>
            <View style={{padding: 10}}>
              <View
                style={{
                  backgroundColor: 'rgba(241,241,241,0.8)',
                  borderRadius: 10,
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#ccc',
                    paddingVertical: 10,
                  }}>
                  <Text style={{color: 'grey', textAlign: 'center'}}>
                    Choose an option to pick an Image
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    actionSheetRef.current.hide();
                    imageAds1('camera');
                  }}
                  style={{
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#ccc',
                  }}>
                  <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                    Take Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    imageAds1('gallery');
                  }}
                  style={{paddingVertical: 12, alignItems: 'center'}}>
                  <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                    Choose from Library
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => actionSheetRef.current.hide()}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'rgb(0,88,200)',
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ActionSheet>
          <ActionSheet
            ref={actionSheetRef2}
            containerStyle={{backgroundColor: 'transparent'}}>
            <View style={{padding: 10}}>
              <View
                style={{
                  backgroundColor: 'rgba(241,241,241,0.8)',
                  borderRadius: 10,
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#ccc',
                    paddingVertical: 10,
                  }}>
                  <Text style={{color: 'grey', textAlign: 'center'}}>
                    Choose an option to pick an Image
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    actionSheetRef.current.hide();
                    imageAds2('camera');
                  }}
                  style={{
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#ccc',
                  }}>
                  <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                    Take Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    imageAds2('gallery');
                  }}
                  style={{paddingVertical: 12, alignItems: 'center'}}>
                  <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                    Choose from Library
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => actionSheetRef.current.hide()}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'rgb(0,88,200)',
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ActionSheet>
          <ActionSheet
            ref={actionSheetRef3}
            containerStyle={{backgroundColor: 'transparent'}}>
            <View style={{padding: 10}}>
              <View
                style={{
                  backgroundColor: 'rgba(241,241,241,0.8)',
                  borderRadius: 10,
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#ccc',
                    paddingVertical: 10,
                  }}>
                  <Text style={{color: 'grey', textAlign: 'center'}}>
                    Choose an option to pick an Image
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    actionSheetRef.current.hide();
                    imageAds3('camera');
                  }}
                  style={{
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#ccc',
                  }}>
                  <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                    Take Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    imageAds3('gallery');
                  }}
                  style={{paddingVertical: 12, alignItems: 'center'}}>
                  <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                    Choose from Library
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => actionSheetRef.current.hide()}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'rgb(0,88,200)',
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ActionSheet>
          <Text
            style={{
              color: Colors.grey,
              fontSize: 22,
              fontWeight: 'bold',
              paddingRight: 220,
              
            }}>
            Set Details
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {imageUri1 ? (
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginVertical: '8%',
                    borderRadius: 20,
                  }}
                  source={{uri: imageUri1}}
                />
                <TouchableOpacity
                  onPress={() => {
                    setImageuri1(null);
                  }}
                  style={{
                    position: 'absolute',
                    left: 78,
                    bottom: 90,
                  }}>
                  <Text
                    style={{
                      fontSize: 34,
                      fontWeight: 'bold',
                      color: 'red',
                    }}>
                    x
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => actionSheetRef1.current.show()}
                style={{
                  backgroundColor: Colors.grey,
                  width: 100,
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: '8%',
                  borderRadius: 20,
                }}>
                <Image
                  source={Icons.uploadBtn}
                  style={{
                    height: 35,
                    width: 35,
                    tintColor: Colors.white,
                  }}
                />
              </TouchableOpacity>
            )}
            {imageUri2 ? (
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginVertical: '8%',
                    borderRadius: 20,
                  }}
                  source={{uri: imageUri2}}
                />
                <TouchableOpacity
                  onPress={() => {
                    setImageuri2(null);
                  }}
                  style={{
                    position: 'absolute',
                    left: 195,
                    bottom: 90,
                  }}>
                  <Text
                    style={{
                      fontSize: 34,
                      fontWeight: 'bold',
                      color: 'red',
                    }}>
                    x
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => actionSheetRef2.current.show()}
                style={{
                  backgroundColor: Colors.grey,
                  width: 100,
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: '8%',
                  borderRadius: 20,
                }}>
                <Image
                  source={Icons.upload}
                  style={{
                    height: 35,
                    width: 35,
                    tintColor: Colors.white,
                  }}
                />
              </TouchableOpacity>
            )}
            {imageUri3 ? (
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginVertical: '8%',
                    borderRadius: 20,
                  }}
                  source={{uri: imageUri3}}
                />
                <TouchableOpacity
                  onPress={() => {
                    setImageuri3(null);
                  }}
                  style={{
                    position: 'absolute',
                    left: 310,
                    bottom: 90,
                  }}>
                  <Text
                    style={{
                      fontSize: 34,
                      fontWeight: 'bold',
                      color: 'red',
                    }}>
                    x
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => actionSheetRef3.current.show()}
                style={{
                  backgroundColor: Colors.grey,
                  width: 100,
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: '8%',
                  borderRadius: 20,
                }}>
                <Image
                  source={Icons.upload}
                  style={{
                    height: 35,
                    width: 35,
                    tintColor: Colors.white,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              marginTop: -14,
            }}>
            <CustomTextInput
              value={title}
              onChangeText={text => setTitle(text)}
              label={'Title'}
            />
            <CustomTextInput
              value={description}
              onChangeText={text => setDescription(text)}
              label={'Description'}
            />
          </View>
          <CustomButton
            onPress={() => {
              NavService.reset(0,[{name: "GuardianAppStack"}])
            }}
            title="Post"
            buttonStyle={{
              marginTop: '20%',
            }}
          />
        </>
      )}
    </>
  );
};

export default CustomSelector;

const styles = StyleSheet.create({});
