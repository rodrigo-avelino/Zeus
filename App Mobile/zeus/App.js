import { StatusBar } from 'expo-status-bar';
import React ,{ useState } from 'react';
import { StyleSheet, Text, View,Button,Image,FlatList,ScrollView } from 'react-native';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {InputWithLabel} from './components/inputWithLabel'
import {Input} from './components/input'
import api from './src/services/api';

//token de autenticaçao
let authToken = "";
let userId = "";
//telas principais
const Tab = createBottomTabNavigator();

const resumoDeGastos = () =>{
  const [valorSomatorio,setValorSomatorio] = useState()
  const [filter,setFilter] = useState("");
  const config = { headers: { Authorization: `Bearer ${authToken}` } }
  let somatorio = 0
  let arrayComprasLista = []
  React.useEffect( () => {
    api.get(`/cachorros/user/${userId}`, config)
    .then((response) => {
      const arrayCompras = response.data.userCachorros[0].compras;
      for(let i = 0; i<arrayCompras.length;i++){
        somatorio += parseFloat(arrayCompras[i].title.split('|')[0])
      }
      setValorSomatorio(somatorio);
    })
    .catch((error)=>{
      console.log(`error: ${error}`)
    })
  }, []);
  api.get(`/cachorros/user/${userId}`, config)
    .then((response) =>{
      const arrayCompras = response.data.userCachorros[0].compras;
      for(let i = 0; i<arrayCompras.length;i++){
        let compraGenerica = { title: 0, createdAt:'',dataFormatada:''}
        compraGenerica.title = arrayCompras[i].title.split('|')[0];
        compraGenerica.createdAt = arrayCompras[i].createdAt.slice(0,10);
        //compraGenerica.createdAt = i;
        compraGenerica.dataFormatada = (`${compraGenerica.createdAt.slice(8,10)}/${compraGenerica.createdAt.slice(5,7)}/${compraGenerica.createdAt.slice(0,4)}`)
        arrayComprasLista.push(compraGenerica)
      }
      //const firstItem= arrayComprasLista.shift();
    })
    .catch((error)=>{
      console.log(`error: ${error}`)
    })
  const[arrayComprasList,setArrayComprasList] = useState(arrayComprasLista)
  let arrayFiltrada = []
  function handleFilter(arr){
    console.log(filter)
    if(filter.length===10){
      for(let i = 0; i<arr.length;i++){
        if (filter == arr[i].dataFormatada){
          arrayFiltrada.push(arr[i])
        }
      }
      setArrayComprasList(arrayFiltrada)
      let somatorioFiltrado = 0
      for(let i = 0; i<arrayFiltrada.length;i++){
        somatorioFiltrado += parseFloat(arrayFiltrada[i].title.split('|')[0])
      }
      setValorSomatorio(`na data filtrada ${somatorioFiltrado}`);
      return
    }
    setArrayComprasList(arrayComprasLista)
    for(let i = 0; i<arrayComprasLista.length;i++){
      somatorio += parseFloat(arrayComprasLista[i].title)
    }
    setValorSomatorio(somatorio);
  }
  return(
    <View style={styles.layout} >
      <StatusBar style='light'/>
      <View>
        <Text style={styles.title} >Você já gastou ao todo {valorSomatorio}R$</Text>
        <Input
        style={styles.title}
        placeholder='filtro'
        value={filter}
        onChangeText={setFilter}
        inputStyle={styles.login}
      />
      <Button title="Filtrar" onPress={()=>{handleFilter(arrayComprasLista)}} color="#757575"/>
      </View>
      <FlatList
        data = {arrayComprasList}
        renderItem = {({ item })=>(
          <Text style={styles.listComponent}>{item.dataFormatada}| Valor: {item.title}R$</Text>
        )}
      />
    </View>
  )
}
const gasto = () =>{
  const navigation = useNavigation();
  const [value,setValue] = useState("");
  const [description,setDescription] = useState("");
  const [date,setDate] = useState("");
  const config = { headers: { Authorization: `Bearer ${authToken}` } }
  let cachorroNome ="";
  let cachorroDate=""
  let cachorroCompras = [];
  let cachorroId ="";
  let cachorroComprasToPut = [];
    api.get(`cachorros/user/${userId}`,config)
    .then((response)=>{
      cachorroId = response.data.userCachorros[0]._id;
      cachorroCompras = response.data.userCachorros[0].compras;
      cachorroNome = response.data.userCachorros[0].title;
      cachorroDate= response.data.userCachorros[0].createdAt;
      for(let i = 0; i< cachorroCompras.length;i++){
        let compraGenerica = { title: 0, assignedTo:userId,createdAt:""}
        compraGenerica.title = cachorroCompras[i].title
        compraGenerica.createdAt = cachorroCompras[i].title.split('|')[2]
        cachorroComprasToPut.push(compraGenerica)
      }
      console.log(cachorroComprasToPut)
    }).catch((err)=>{
      console.log(err)
    })
  const handleNewValue = () =>{
    let compraNova = {title:`${value}|${description}|${date}`, assignedTo:userId, createdAt: date }
    cachorroComprasToPut.push(compraNova)
    api.put(`/cachorros/${cachorroId}`,{
      title: cachorroNome,
      description: 'descricao',
      compras: cachorroComprasToPut
    },config)
    .then(({data})=>{
      alert('Valor adicionado com sucesso')
      navigation.navigate('Init')
      navigation.navigate('Main',{ screen: 'gasto' })
    }).catch((err)=>{
      console.log(err)
    })
  }

  return(
    <ScrollView>
    <View style={styles.layout} >
      <StatusBar style='light'/>
      <InputWithLabel
        style={styles.title}
        label='Inserir um novo gasto'
        placeholder='Valor'
        value={value}
        onChangeText={setValue}
        inputStyle={styles.login}
      />
      <InputWithLabel
        style={styles.title}
        label='Inserir Descrição'
        placeholder='Descrição'
        value={description}
        onChangeText={setDescription}
        inputStyle={styles.login}
      />
      <InputWithLabel
        style={styles.title}
        label='Insira a data'
        placeholder='data'
        value={date}
        onChangeText={setDate}
        inputStyle={styles.login}
      />
      <View style={styles.button}>
        <Button title="Adicionar" onPress={()=>{handleNewValue()}} color="#757575"/>
      </View>
    </View>
    </ScrollView>
  )
}
const home = () =>{
  const navigation = useNavigation();
  const [cachorros,setCachorros] = useState([])
  const [nomeCachorro,setNomeCachorro] = useState("")
  const config = { headers: { Authorization: `Bearer ${authToken}` } }
  React.useEffect( () => {
    api.get(`/cachorros/user/${userId}`, config)
    .then((response) => {
        setCachorros(response.data.userCachorros)
    })
    .catch((error)=>{
      console.log(`error: ${error}`)
    })
  }, []);
  const handleDogRegister = () =>{
    api.post('/cachorros',{
      title: nomeCachorro,
      description: "descriçao",
      compras: []
    }, config)
    .then(({data})=>{
      navigation.navigate('Init')
      navigation.navigate('Main')
    }).catch((err)=>{
      console.log(err)
      alert('erro no cadastro, tente novamente')
    }) 
  }
  if(cachorros.length>0){
    return(
      <View style={styles.layout} >
        <StatusBar style='light'/>
        <Text style={styles.title}>Bem vindo {cachorros[0]?.user.name}, Cachorro cadastrado: {cachorros[0]?.title}</Text>
      </View>
    )
  }
  return(
    <View style={styles.layout} >
      <StatusBar style='light'/>
      <Text style={styles.title}>Bem Vindo {cachorros[0]?.user.name}, Você ainda não possui cachorro cadastrado, faça abaixo um novo cadastro</Text>
      <InputWithLabel
        style={styles.title}
        label='Nome do novo cachorro'
        placeholder='Nome'
        value={nomeCachorro}
        onChangeText={setNomeCachorro}
        inputStyle={styles.login}
      />
      <View style={styles.button}>
      <Button title="Cadastrar" onPress={()=>{handleDogRegister()}} color="#757575"/>
      </View>
    </View>
  )
}

const MainNavigator = () =>{
  return(
    <Tab.Navigator >
      <Tab.Screen name="home" component={home} options={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => (
          <View style={{alignItems:'center',justifyContent:'center',top:0}}>
            <Image
              source={require('./assets/pngegg.png')}
              resizeMode = 'contain'
              style={{width:25,height:25,tintColor: focused ? 'red' : '#757575'}}
            />
            <Text style={{color: focused ? 'red': '#757575',fontSize:12}}>Home</Text>
          </View>
        ),
      }} />
      <Tab.Screen name="gasto" component={gasto} options={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => (
          <View style={{alignItems:'center',justifyContent:'center',top:0}}>
            <Image
              source={require('./assets/cash-icon-png-24.jpg')}
              resizeMode = 'contain'
              style={{width:25,height:25,tintColor: focused ? 'red' : '#757575'}}
            />
            <Text style={{color: focused ? 'red': '#757575',fontSize:12}}>Gastos</Text>
          </View>
        ),
      }} />
      <Tab.Screen name="resumoDeGastos" component={resumoDeGastos} options={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => (
          <View style={{alignItems:'center',justifyContent:'center',top:0}}>
            <Image
              source={require('./assets/6f3ee02c67912c31632335bba755dd1d.png')}
              resizeMode = 'contain'
              style={{width:25,height:25,tintColor: focused ? 'red' : '#757575'}}
            />
            <Text style={{color: focused ? 'red': '#757575',fontSize:12}}>Resumo</Text>
          </View>
        ),
      }} />
    </Tab.Navigator>
  )
}

/*
*/

//telas iniciais
const Stack = createNativeStackNavigator()

const initScreen = () =>{
  const navigation = useNavigation();
  const [login,setLogin] = useState("");
  const [password,setPassword] = useState("");
  const logo = require('./assets/pngwing.com.png')
  const handleLogin = () =>{
    api.post("/auth/authenticate",{
      email: login,
      password: password,
    })
    .then(({data})=>{
      authToken = data.token;
      userId = data.user._id;
      navigation.navigate('Main')
    }).catch((err)=>{
      alert("erro no login, tente novamente")
    })
  }
  return(
    <ScrollView>
    <View style={styles.layout}>
      <Image style={styles.image} source={logo}/>
      <InputWithLabel
        style={styles.title}
        label='Logar'
        placeholder='Login'
        value={login}
        onChangeText={setLogin}
        inputStyle={styles.login}
      />
      <Input
        style={styles.title}
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        inputStyle={styles.login}
        secureTextEntry
      />
      <View style={styles.button}>
        <Button title="Login" onPress={()=>handleLogin()} color="#757575"/>
        <Text style={styles.title} >Não possui conta?</Text>
        <Button title="Cadastrar" onPress={()=>navigation.navigate('singUp')} color="#757575"/>
      </View>
    </View>
    </ScrollView>
  )
}

const singUpScreen = () =>{
  const navigation = useNavigation();
  const [newLogin,setNewLogin] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [email,setEmail] = useState("");
  //logica de register 
  const handleRegister = () =>{
    api.post("/auth/register",{
      name: newLogin,
      email: email,
      password: newPassword,
    })
    .then(({data})=>{
      navigation.navigate('Init')
    }).catch((err)=>{
      alert("erro no cadastro, tente novamente")
    })
  }

  //logica para confirmar senha
  const confirmPasswordMatch = (props) =>{
  const { nativeEvent: {text} } = props;

  if(text!==newPassword){
    alert('passwords dont match, please,try again')
  }
}
////logica para confirmar senha

  return(
    <ScrollView>
    <View style={styles.layout}>
    <InputWithLabel
        style={styles.title}
        label='Nome de usuario'
        placeholder='Nome de usuario'
        value={newLogin}
        onChangeText={setNewLogin}
        inputStyle={styles.login}
      />
      <InputWithLabel
        style={styles.title}
        label='Email'
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        inputStyle={styles.login}
      />
      <InputWithLabel
        style={styles.title}
        label='Senha'
        placeholder='Senha'
        value={newPassword}
        onChangeText={setNewPassword}
        inputStyle={styles.login}
        secureTextEntry
      />
      <InputWithLabel
        style={styles.title}
        label='Confirmar Senha'
        placeholder='Confirmar Senha'
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        inputStyle={styles.login}
        secureTextEntry
        onSubmitEditing ={confirmPasswordMatch}
      />
      <View style={styles.button}>
        <Button title="Cadastrar" onPress={()=>{handleRegister()}} color="#757575"/>
      </View>
  </View>
  </ScrollView>
  );
}



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Init" component={initScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="singUp" component={singUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#c2c2c2',
    width:'100%',
  },
  title: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#FFFFFF',
  },
  login: {
    borderColor:'#FFFFFF',
    borderWidth:2,
    borderRadius:10
  },
  button:{
    paddingHorizontal:100,
    marginTop:100
  },
  image: {
    width:150,
    height:150,
    alignSelf:'center'
  },
  listComponent: {
    padding: 8,
    backgroundColor: '#5e5e5e',
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    color:'#FFFFFF',
    borderRadius: 10
  }
});
