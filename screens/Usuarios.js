import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView } from "react-native";
import axios from "axios";
import { Table, Row, Rows } from "react-native-table-component"; //yarn add react-native-table-component   

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setContrasena] = useState("");
    const [rol_id, setRol] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [tableData, setTableData] = useState([]);
    const apiUrl = "http://localhost:3000/api/usuarios";

    useEffect(() => {
        verListaUsuarios();
    }, []);

    const verListaUsuarios = async () => {
        try {
            const response = await axios.get(apiUrl);
            setUsuarios(response.data);

            //aqui se hace la configuracion de los datos para la tabla con las variables
            const data = response.data.map((usuario) => [
                usuario.username,
                '******',
                /* usuario.password, */
                usuario.rol_id,
                <View style={styles.buttonContainer}>
                    <Button title="Editar" onPress={() => editarUsuarios(usuario)} />
                </View>,
                <View style={styles.buttonContainer}>
                    <Button title="Borrar" color="red" onPress={() => borrarUsuario(usuario.id)} />
                </View>
            ]);
            setTableData(data);
        } catch (error) {
            Alert.alert("Error", "No se pudo obtener la lista de usuarios");
        }
    };

    const actualizarUsuario = async () => {
        if (!editingUserId) return;
        try {
            await axios.put(`${apiUrl}/${editingUserId}`, { username, password, rol_id });
            Alert.alert("Usuario actualizado");
            limpiarCampos();
            verListaUsuarios();
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el usuario");
        }
    };

    const editarUsuarios = (usuario) => {
        setUsername(usuario.username);
        setContrasena(usuario.password);
        setRol(usuario.rol_id);
        setEditingUserId(usuario.id);
    };

    const borrarUsuario = async (id) => {
        try {
            await axios.delete(`${apiUrl}/${id}`);
            Alert.alert("Usuario eliminado");
            verListaUsuarios();
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el usuario");
        }
    };

    const limpiarCampos = () => {
        setUsername("");
        setContrasena("");
        setRol("");
        setEditingUserId(null);
    };

    return (
        <ScrollView>
            <View style={styles.container}>
            <Text style={styles.header}>Actualizar Datos</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setContrasena}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Rol"
                    value={rol_id}
                    onChangeText={setRol}
                />
                <Button 
                    title="Actualizar Usuario" 
                    onPress={actualizarUsuario} 
                    disabled={!editingUserId} 
                />

                <Table borderStyle={{ borderWidth: 1, borderColor: '#abb2b9' }} style={styles.table}> 
                    <Row
                        data={["Username", "Contraseña", "Rol", "Editar", "Borrar"]}
                        style={styles.head}
                        textStyle={styles.headText}
                    />
                    <Rows
                        data={tableData}
                        textStyle={styles.text}
                    />
                </Table>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: "5%",
    },
    input: {
        backgroundColor: "white",
        width: '90%',
        borderColor: '#e8e8e8',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginVertical: 8,
    },
    table: {
        width: '90%',
        marginTop: 20,
    },
    head: {
        height: 50,
        backgroundColor: '#d6dbdf', //fondo de color de la tabla
    },
    headText: {
        textAlign: "center",
        fontWeight: "bold",
      
    },
    text: {
        margin: 6,
        textAlign: "center",
        
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 60, //se mueve el encabezado principal
    }
   
});

export default Usuarios;
