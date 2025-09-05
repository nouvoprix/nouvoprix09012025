import {ScrollView, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {compose} from 'redux';
import AppBackground from '../../components/AppBackground';
import {Colors} from '../../config';
class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {content} = this.props.route.params;
    const Policy = content?.data?.content;
    const {t} = this?.props;
    return (
      <AppBackground
        back
        title={t('str_Privacy_Policy')}
        rightIcon={false}
        notification={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{color: Colors.black, marginTop: 10}}>
            {!Policy ? `${t('str_Privacy_Policy')}` : Policy}
          </Text>
        </ScrollView>
      </AppBackground>
    );
  }
}

export default withTranslation()(PrivacyPolicy);
