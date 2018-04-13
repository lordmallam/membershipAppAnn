import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Picker, TouchableWithoutFeedback,
DatePickerAndroid, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { Button, TextBox, Dropdown } from '../common'
import Config from '../../config';
import { IsUndefinedOrNull } from '../../utils'

class Register extends Component {
    state = {
        sex: 'Sex',
        firstName: '',
        surname: '',
        dob: 'Date of birth',
        email: '',
        address: '',
        phone: '',
        state: 'state',
        lga: 'lga',
        lgasByStates: [],
        password: ''
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

    onNext = () => {
        const validateForm = () => (
            this.state.sex !== 'sex' && !IsUndefinedOrNull(this.state.firstName) && !IsUndefinedOrNull(this.state.surname)
            && !IsUndefinedOrNull(this.state.email) &&  !IsUndefinedOrNull(this.state.address) &&
            !IsUndefinedOrNull(this.state.phone) && this.state.dob !== 'Date of birth' && this.state.state !== 'state'
            && this.state.lga !== 'lga' && !IsUndefinedOrNull(this.state.password)
        );
        if(validateForm()) {
            if(this.state.password.length <= 6) {
                ToastAndroid.showWithGravity('Password must be more than 6 characters', 
                ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            } else {
            Actions.nok({member: 
                {
                    sex: this.state.sex,
                    firstname: this.state.firstName,
                    surname: this.state.surname,
                    dateOfBirth: new Date(this.state.dob),
                    email: this.state.email,
                    residenceAddress: this.state.address,
                    phone: this.state.phone,
                    state: this.state.state,
                    lga: this.state.lga,
                    password: this.state.password
                }
            });
        }
        } else {
            ToastAndroid.showWithGravity('Fill all fields to proceed.', 
          ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    };

    loadStates = () => {
        const results = [];
        this.props.states.forEach(element => {
            results.push(<Picker.Item label={element.name} value={element._id} key={element._id}/>);
        });
        return results;
    };

    loadLgasByState = (state) => {
        const results = [];
        this.props.lgas.filter(row => (row.state === state)).forEach(element => {
            results.push(<Picker.Item label={element.name} value={element._id} key={element._id}/>);
        });
        this.setState({
            lgasByStates: results
        })
    };
    render() {
        return(
            <ScrollView>
                <View style={{ flex: 1 }}>
                <View>
                <Image
                    style={style.logoStyle} resizeMode='contain'
                    source={Config.resources.logo}
                />
                </View>
                <Text style={{ fontSize: 20, color: '#73b650', alignSelf: 'center' }}>Become a member</Text>
                <Text style={{ fontSize: 14, color: '#6d6d6d', alignSelf: 'center', marginTop: 10 }}>Personal details</Text>
                <View style={{ backgroundColor: '#fff', padding: 15, margin: 15, borderRadius: 10, elevation: 2 }}>
                <TextInput 
                placeholder='First name'
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={style.textStyle}
                onChangeText={text => this.setState({firstName: text})}
                value={this.state.firstName}
                /> 
                <TextInput 
                placeholder='Surname'
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
                    style={[this.state.dob === 'Date of birth' ? {color: '#CCC'} : { color: '#000' }, {flex: 3}]}
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
                style={this.state.sex === 'Sex' ? {color: '#CCC'} : { color: '#000' }}
                >
                <Picker.Item label="Sex" value="Sex" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                </Picker>                
                </View>
                <TextInput 
                placeholder='Email'
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={[style.textStyle, {marginTop: 10}]}
                onChangeText={text => this.setState({email: text})}
                value={this.state.email}
                keyboardType='email-address'
                />
                <TextInput 
                placeholder='Password'
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={[style.textStyle, {marginTop: 10}]}
                onChangeText={text => this.setState({password: text})}
                value={this.state.password}
                secureTextEntry
                />
                <TextInput 
                placeholder='Phone number'
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={style.textStyle}
                onChangeText={text => this.setState({phone: text})}
                value={this.state.phone}
                keyboardType='phone-pad'
                />
                <TextInput 
                placeholder='Contact Address'
                placeholderTextColor='#CCC'
                underlineColorAndroid='#c0c0c0'
                style={style.textStyle}
                onChangeText={text => this.setState({address: text})}
                value={this.state.address}                
                multiline
                numberOfLines={3}
                />
                <View style={style.border}>
                <Picker
                selectedValue={this.state.state}
                onValueChange={(itemValue, itemIndex) => {this.setState({state: itemValue}); this.loadLgasByState(itemValue)}}
                style={this.state.state === 'state' ? {color: '#CCC'} : { color: '#000' }}
                >
                <Picker.Item label="State of origin" value="state" />
                {this.loadStates()}
                </Picker>              
                </View>
                <View style={[style.border, {}]}>
                <Picker
                selectedValue={this.state.lga}
                onValueChange={(itemValue, itemIndex) => this.setState({lga: itemValue})}
                style={this.state.lga === 'lga' ? {color: '#CCC'} : { color: '#000' }}
                >
                <Picker.Item label="Local Govt. Area" value="lga" />
                {this.state.lgasByStates}
                </Picker>            
                </View>
                </View>
                <Button 
                Text='Next'
                onPress={this.onNext.bind(this)}
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
    states: state.auth.states,
    lgas: state.auth.lgas
});
  
export default connect(mapStateToProps, {})(Register);