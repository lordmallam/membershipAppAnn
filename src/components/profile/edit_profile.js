import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Picker, TouchableWithoutFeedback,
DatePickerAndroid, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { Button, TextBox, Dropdown, MainMenu, Header } from '../common'
import Config from '../../config';
import { IsUndefinedOrNull } from '../../utils'

class EditProfile extends Component {
    state = {
        sex: 'sex',
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

    componentDidMount() {
      if(this.props.member){
        const member = {...this.props.member};
        this.setState({
        sex: member.sex, 
        firstName: member.firstname,
        surname: member.surname,
        dob: moment(new Date(member.dateOfBirth)).format('DD MMMM, YYYY'),
        email: member.email,
        address: member.residenceAddress,
        phone: member.phone,
        state: member.state,
        lga: member.lga
        });
      }
    }

    onNext = () => {
        const validateForm = () => (
            this.state.sex !== 'sex' && !IsUndefinedOrNull(this.state.firstName) && !IsUndefinedOrNull(this.state.surname)
            && !IsUndefinedOrNull(this.state.email) &&  !IsUndefinedOrNull(this.state.address) &&
            !IsUndefinedOrNull(this.state.phone) && this.state.dob !== 'Date of birth' && this.state.state !== 'state'
            && this.state.lga !== 'lga'
        );
        if(validateForm()) {
            Actions.editNok({uMember: 
                {
                    sex: this.state.sex,
                    firstname: this.state.firstName,
                    surname: this.state.surname,
                    dateOfBirth: new Date(this.state.dob),
                    email: this.state.email,
                    residenceAddress: this.state.address,
                    phone: this.state.phone,
                    state: this.state.state,
                    lga: this.state.lga
                }
            });
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
          <MainMenu 
            id={'mainMenu'}
            ref={'menu'}
            info={{ user: this.props.user }}
        >
        <Header pageName='Edit Profile' openMenu={this.openMenu}/>
        <ScrollView style={{ flex: 1}}>
            <View>
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
                <View style={{ flexDirection: 'row' }}>
                <Text 
                style={{flex: 3, color: '#CCC'}}
                >{this.state.dob}</Text>
                <View style={{ flex: 1, paddingRight: 10}}>
                <Text style={{ color: '#c0c0c0', fontFamily: 'fontawesome', fontSize: 20, alignSelf: 'flex-end'}}>&#xf073;</Text>
                </View>
                </View>
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
            editable={false}
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
        </MainMenu>
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
    lgas: state.auth.lgas,
    member: state.auth.member
});
  
export default connect(mapStateToProps, {})(EditProfile);