import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

//Sem usar a lib do supabase, fariamos a seguinte request
/* fetch('${SUPABASE_URL}/rest/v1/tbMessage?select=*', {
    headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    }
}) 
    .then((res) => {
        return res.json();
    })
    .then((response) => {
        console.log(response);
    });
*/


const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwNTQ3OSwiZXhwIjoxOTU4ODgxNDc5fQ.NK4NIfaNFm1wN3Srsx3HIoA3VWsk6u-RiuQWIW4Oe1c';
const SUPABASE_URL = 'https://mkslgggiznhmrbljnpxb.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getMessage(adicionaMsg) { //Só é chamado uma vez, por que vai criar uma function trigger no banco que executa toda vez que ouver um insert na tbMessage
    return supabaseClient
        .from('tbMessage')
        .on('INSERT', (response) => {
            adicionaMsg(response.new);
        })
        .subscribe();
} //É necessário ativar real time no supabase

export default function ChatPage() {
    const roteamento = useRouter();
    const userLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [chatMsg, setChatMsg] = React.useState([]);

    //Por padrão, o useEffect acontece toda vez que a página carrega
    React.useEffect(() => {
        //Semelhante a promessa, esta puxando dados e não esta pronto, entõa não iremos armazenar em uma var
        supabaseClient
            .from('tbMessage')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => { //Ao invés de pegar toda a response da request, podemos filtrar com {}
                setChatMsg(data);
            });

        getMessage((novaMensagem) => {
            //... significa percorrer os elementos do array (se não estariamos criando um array dentro do outro)
            // Importante lembrar dos [], pois neste caso estamos trabalhando com arrays
            setChatMsg((valorAtualDaLista) => {
                return [
                    novaMensagem, //Formando um array de objetos
                    ...valorAtualDaLista //As novas mensagens devem ser as mais recentes no chat e portanto as primeiras a serem acessadas no array
                ]
            });
        });
    }, []) //Os [] são novos parâmetros para acionar o useEffect, vai rodar toda vez que a variavel [var] for alterada

    function handleNovaMsg(novaMensagem) {
        //Objeto -> não mais string
        const mensagem = {
            //id: chatMsg.length,
            name: userLogado,
            text: novaMensagem,
        }

        supabaseClient
            .from('tbMessage')
            .insert([
                mensagem
            ])
            .then(({ data }) => {

            })

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: 'url(https://funfactorpt.files.wordpress.com/2018/12/markus-detroit-become-human-2018-5g-1.jpg?w=1920&h=1080&crop=1)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList msgs={chatMsg} />
                    {/*Foreach -> laço de repetição para percorrer os valores do array, mas não retorna valor
                    podemos usar map */}
                    {//chatMsg.map((msgAtual) => { //msgAtual funciona como array[i]
                        //   return <li key={msgAtual.id}>{msgAtual.texto}</li>
                        //})
                    }

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            /*arrow function -> função enxugada = function () {} == () => {}*/
                            onChange={(event) => {
                                setMensagem(event.target.value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key == 'Enter') {
                                    event.preventDefault(); //Não ira executar sua função primária
                                    handleNovaMsg(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/*Callback -> chamada de retorno. Quando algo que você queria finalizou e retorna para realizar determinada função*/}
                        <ButtonSendSticker  //Enviando uma função que pode ser executada no componente
                            onStickerClick={(sticker) => {
                                handleNovaMsg(`:sticker:${sticker}`); // ou (':sticker:' + sticker)
                            }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {props.msgs.map((mensagemAtual) => {
                return (
                    <Text
                        key={mensagemAtual.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagemAtual.name}.png`}
                            />
                            <Text tag="strong">
                                {mensagemAtual.name}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagemAtual.text.startsWith(':sticker:') ?
                            (
                                <Image src={mensagemAtual.text.replace(':sticker:', '')} />
                            ) :
                            (
                                mensagemAtual.text
                            )}
                    </Text>
                );
            })}

        </Box>
    )
}