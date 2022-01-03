import React, { useState } from 'react';
import { View, ScrollView ,Text,TextInput } from 'react-native';

export const InputWithLabel = (props) =>{
    const {label,placeholder,value,onChangeText,secureTextEntry,onSubmitEditing,style,inputStyle} = props
    return (
      <View style={style}>
        <Text style={style}>{label}</Text>
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
