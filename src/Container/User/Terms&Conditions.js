import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {compose} from 'redux';
import AppBackground from '../../components/AppBackground';
import {Colors} from '../../config';
class TermsConditions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {content} = this?.props?.route.params;
    const Terms = content?.data?.content;
    const {t} = this.props;

    return (
      <AppBackground
        back
        title={t('Terms_&_Conditions')}
        rightIcon={false}
        notification={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{color: Colors.black, marginTop: 10}}>
            {!Terms ? t('Terms_and_Condition') : Terms}
          </Text>
        </ScrollView>
      </AppBackground>
    );
  }
}

export default withTranslation()(TermsConditions);
