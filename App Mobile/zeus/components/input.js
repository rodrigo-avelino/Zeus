import React, { useState } from 'react';
import { View, ScrollView ,Text,TextInput } from 'react-native';

export const Input = (props) =>{
    const {placeholder,value,onChangeText,secureTextEntry,onSubmitEditing,style,inputStyle} = props
    return (
      <View style={style}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onSubmitEditing={onSubmitEditing}
          style={inputStyle}
        />
      </View>
    );
  }