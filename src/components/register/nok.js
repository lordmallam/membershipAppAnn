import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Picker, TouchableWithoutFeedback,
DatePickerAndroid, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { Button, TextBox, Dropdown, SuccessModalView, ErrorModalView } from '../common'
import Config from '../../config';
import { IsUndefinedOrNull } from '../../utils';

class NOK extends Component {
    state = {
        sex: "sex",
        firstName: '',
        surname: '',
        dob: "Next of kin's Date of birth",
        showModal: false,
        state: 'state',
        nationality: 'nationality',
        email: '',
        phone: '',
        showErrorModal: false,
        error: ''
    }

    setDoB = async () => {
        try {
            const setDate = new Date();
            if(this.state.dob !== 'Date of birth') {
                setDate = new Date(this.state.dob);
            }
            const {action, year, month, day} = await DatePickerAndroid.open({
              date: setDate
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                month = month + 1;
                if (day > 0 && day <= 9) {
                    day = `0${day}`;
                }
                if (month > 0 && month <= 9) {
                    month = `0${month}`;
                }
                this.setState({
                    dob: moment(new Date(`${year}-${month}-${day}`))
                    .format('DD MMMM, YYYY')
                });
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }
    };

    onRegister = () => {
        const validateForm = () => (
            !IsUndefinedOrNull(this.state.firstName) && !IsUndefinedOrNull(this.state.surname)
            && !IsUndefinedOrNull(this.state.email) && !IsUndefinedOrNull(this.state.phone)
            && this.state.sex !== 'sex' && this.state.state !== 'state'  && this.state.nationality !== 'nationality' 
        );
        if(validateForm()){
            const member = this.props.member;
            member.nok = {
                sex: this.state.sex,
                firstname: this.state.firstName,
                surname: this.state.surname,
                dateOfBirth: new Date(this.state.dob),
                state: this.state.state,
                nationality: this.state.nationality,
                email: this.state.email,
                phone: this.state.phone
            }
            member.isMobile = true;
            let URL = `${Config.environmentAuthority.apiUrl}members/register`;
            const opts = {
            method: 'POST',
            body: JSON.stringify(member),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
                }
            };
            fetch(URL, opts)
            .then(res => res.json())
            .then(res => { 
                console.log(res);
                if(res.error){
                    this.setState({error: res.message});
                    this.onSetErrorModalVisible(true);
                } else {
                this.onSetModalVisible(true);
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({error: err.message});
                this.onSetErrorModalVisible(true);
            })
        } else {
            ToastAndroid.showWithGravity('Fill all fields to proceed.', 
            ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    };

    onSetModalVisible = visible => {
        this.setState({
            showModal: visible
        });
    };

    onSetErrorModalVisible = visible => {
        this.setState({
            showErrorModal: visible
        });
    };

    onRequestClose = () => {};

    onOKay = () => {
        this.onSetModalVisible(false);
        Actions.auth();
    };

    onOKayError = () => {
        this.onSetErrorModalVisible(false);
        if(this.state.error === 'This email is already in use but not active, an email has been sent to your mailbox. Follow the link to active your account'){
            Actions.auth();
        }
    }

    loadStates = () => {
        const results = [];
        this.props.states.forEach(element => {
            results.push(<Picker.Item label={element.name} value={element._id} key={element._id}/>);
        });
        return results;
    };

    render() {
        return(
            <ScrollView>
                <View style={{ flex: 1 }}>
                <ErrorModalView
                    visible={this.state.showErrorModal} onRequestClose={this.onRequestClose}
                    style={{ flex: 1, padding: 0 }}
                    >                    
                    <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 20, color: '#338fc2', alignSelf: 'center'}}>Error Occured!</Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'center', marginTop: 20, marginBottom: 20, textAlign: 'center'}}>
                    {this.state.error}</Text>
                    <Button 
                        Text='Okay'
                        onPress={this.onOKayError.bind(this)}
                        style={{
                        backgroundColor: '#db2f2f',
                        marginLeft: 30,
                        marginRight: 30,
                        flex: 0,
                        borderRadius: 10,
                        elevation: 2
                        }} />
                    </View>
                </ErrorModalView>
                <SuccessModalView
                    visible={this.state.showModal} onRequestClose={this.onRequestClose}
                    style={{ flex: 1, padding: 0 }}
                    >                    
                    <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 20, color: '#338fc2', alignSelf: 'center'}}>Registration Submitted!</Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'center', marginTop: 20, marginBottom: 20, textAlign: 'center'}}>
                    Check your email and follow the link to compelet the registration process.</Text>
                    <Button 
                        Text='Okay'
                        onPress={this.onOKay.bind(this)}
                        style={{
                        backgroundColor: '#73b650',
                        marginLeft: 30,
                        marginRight: 30,
                        flex: 0,
                        borderRadius: 10,
                        elevation: 2
                        }} />
                    </View>
                </SuccessModalView>
                <View>
                <Image
                    style={style.logoStyle} resizeMode='contain'
                    source={Config.resources.logo}
                />
                </View>
                <Text style={{ fontSize: 20, color: '#73b650', alignSelf: 'center' }}>Become a member</Text>
                <Text style={{ fontSize: 14, color: '#6d6d6d', alignSelf: 'center', marginTop: 10 }}>Next of kin's details</Text>
                <View style={{ backgroundColor: '#fff', padding: 15, margin: 15, borderRadius: 10,
                elevation: 2}}>
                <TextInput 
                placeholder="Next of kin's First name"
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={style.textStyle}
                onChangeText={text => this.setState({firstName: text})}
                value={this.state.firstName}
                /> 
                <TextInput 
                placeholder="Next of kin's Surname"
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={style.textStyle}
                onChangeText={text => this.setState({surname: text})}
                value={this.state.surname}
                /> 
                <View style={[style.border, {paddingBottom: 10, paddingTop: 10}]}>
                    <TouchableWithoutFeedback onPress={this.setDoB}>
                    <View style={{ flexDirection: 'row' }}>
                    <Text 
                    style={[this.state.dob === "Next of kin's Date of birth" ? {color: '#CCC'} : { color: '#000' }, {flex: 3}]}
                    >{this.state.dob}</Text>
                    <View style={{ flex: 1, paddingRight: 10}}>
                    <Text style={{ color: '#c0c0c0', fontFamily: 'fontawesome', fontSize: 20, alignSelf: 'flex-end'}}>&#xf073;</Text>
                    </View>
                    </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={style.border}>
                <Picker
                selectedValue={this.state.sex}
                onValueChange={(itemValue, itemIndex) => this.setState({sex: itemValue})}
                style={this.state.sex === "sex" ? {color: '#CCC'} : { color: '#000' }}
                >
                <Picker.Item label="Next of kin's Sex" value="sex" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                </Picker>                
                </View>
                <TextInput 
                placeholder="Next of kin's Email"
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={[style.textStyle, {marginTop: 10}]}
                onChangeText={text => this.setState({email: text})}
                value={this.state.email}
                keyboardType='email-address'
                />
                <TextInput 
                placeholder="Next of kin's Phone number"
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={style.textStyle}
                onChangeText={text => this.setState({phone: text})}
                value={this.state.phone}
                keyboardType='phone-pad'
                />
                <View style={style.border}>
                <Picker
                selectedValue={this.state.state}
                onValueChange={(itemValue, itemIndex) => {this.setState({state: itemValue})}}
                style={this.state.state === 'state' ? {color: '#CCC'} : { color: '#000' }}
                >
                <Picker.Item label="Next of kin's state of origin" value="state" />
                {this.loadStates()}
                </Picker>              
                </View>

                <View style={style.border}>
                <Picker
                selectedValue={this.state.nationality}
                onValueChange={(itemValue, itemIndex) => {this.setState({nationality: itemValue})}}
                style={this.state.nationality === 'nationality' ? {color: '#CCC'} : { color: '#000' }}
                >
                <Picker.Item label="Next of kin's nationality" value="nationality" />
                <Picker.Item label='Nigerian' value='Nigerian' />
                </Picker>
                </View>

                </View>
                <Button 
                Text='Register'
                onPress={this.onRegister}
                style={{
                backgroundColor: '#73b650',
                marginLeft: 10,
                marginRight: 10,
                flex: 0,
                borderRadius: 10,
                elevation: 2
                }}
                />
                </View>
            </ScrollView>
        );
    };
}

const style = {
    textStyle: {
        fontSize: 15
    },
    logoStyle: {
        width: 70,
        height: 70,
        marginBottom: 10,
        marginTop: 15,
        alignSelf: 'center'
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: '#c0c0c0',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5
    }
};

const mapStateToProps = state => ({
    states: state.auth.states
});
  
export default connect(mapStateToProps, {})(NOK);