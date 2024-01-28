import {
    Alert,
    FlatList,
    Image, Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput, ToastAndroid,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import React, {useRef, useState} from 'react';
import useFonts from "../../hooks/useFonts";
import {polyfill, polyfill as polyfillFetch} from 'react-native-polyfill-globals/src/fetch';

const API_CHAT_GPT = "https://api.openai.com/v1/chat/completions"
const API_KEY = "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"

function notifyMessage(msg: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.LONG)
    } else {
        Alert.alert(msg)
    }
}

const gptModelList = ["gpt-4-1106-preview", "gpt-4-vision-preview"]

export default function HomeScreen() {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [messageRequestList, setMessageRequestList ] = useState([]);
    const scrollViewRef = useRef();
    const handleSend = async () => {
        // Implement your logic to send the message
        console.log('Sending message:', message);
        if (message.length === 0) {
            notifyMessage("Can't send empty message")
        } else {
            setMessage('');
            const messageRequest = {
                role: "user",
                content: message
            }
            messageRequestList.push(messageRequest)
            scrollViewRef.current.scrollToEnd({animated: true});
            console.log(`setMessageRequestList ${JSON.stringify(messageRequestList)}`)
            const chat_gpt_fetch = await fetch(API_CHAT_GPT, {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer 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',
                },
                body: JSON.stringify({
                    model: gptModelList[0],
                    messages: messageRequestList
                }),
            }).then((response) =>response.json()).then((data) => {
                console.log("Response: " + JSON.stringify(data))
                const messageRequest = {
                    role: data.choices[0].message.role,
                    content: data.choices[0].message.content
                }
                // messageRequestList.push(messageRequest)
                setMessageRequestList((prevMessages) => [...prevMessages, messageRequest]);
                console.log(JSON.stringify(messageRequestList))
                scrollViewRef.current.scrollToEnd({animated: true});
            }).catch(error => {
                console.log("Error: " + error)
            });
        }
    };
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={require('./../assets/images/sample_profile.jpg')}
                   style={styles.profileImage}/>
            <Text style={styles.text}>{item}</Text>
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{opacity: 0, height: 0}}>Home</Text>
                <Text style={styles.headerTitle}>Riya</Text>
                <Image source={require('./../assets/images/sample_profile.jpg')}
                       style={styles.profileImage}/>
            </View>
            <ScrollView ref={scrollViewRef} style={styles.chatScreen}>
                {/*<FlatList data={messageList} renderItem={renderItem}*/}
                {/*          keyExtractor={(item) => item.id}*/}
                {/*          contentContainerStyle={styles.container}/>*/}

                {messageRequestList.map((item) => (
                    <View key={item.userId} style={styles.item}>
                        <Image source={require('./../assets/images/sample_profile.jpg')}
                               style={styles.chatProfileImage}/>
                        <Text style={styles.text}>{item.content}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.chatBox}>
                {/* Left: Add Image Button */}
                <TouchableOpacity style={styles.imageButton}>
                    <Image source={require('./../assets/images/ic_add.png')} style={styles.imageIcon} />
                </TouchableOpacity>

                {/* Center: Multiline Text Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Type your message..."
                    multiline
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    numberOfLines={1} // Set a fixed number of lines to make it multiline
                />

                {/* Right: Send Button */}
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Image source={require('./../assets/images/ic_send.png')} style={styles.sendIcon} />
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        color: '#fff'
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginStart: 16,
        marginEnd: 16,
        marginTop: 30,
        marginBottom: 12,
        alignItems: "center",
    },
    headerTitle: {
        fontFamily: 'DancingScript',
        fontSize: 32,
        color: '#fff',
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderColor: '#9c2bb3',
        borderWidth: 1
    },
    chatScreen: {
        flex: 12,
        backgroundColor: '#000',
        marginBottom: 12,
        color: '#fff',
    },
    chatBox: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,

    },
    imageButton: {
        marginRight: 12,
    },
    imageIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: '#fff'
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxHeight: 100,
        textAlignVertical: 'top', // Align text to the top in multiline mode
        color: 'white'
    },
    sendButton: {
        marginLeft: 12,
    },
    sendIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: '#fff'
    },
    item: {
        flexDirection: "row",
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        color: '#fff',
        alignItems: "center",
    },
    text: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 12,
    },
    chatProfileImage: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        borderColor: '#9c2bb3',
        borderWidth: 1
    },
})
