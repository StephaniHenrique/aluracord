import appConfig from '../config.json';
import React from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Text, TextField, Image } from '@skynexui/components';

//Usartag vazia <> </> para agrupar
//As aspas servem para utilizar as props js em css
function Titulo(props) {
    const Tag = props.tag || 'h1';
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
                ${Tag}{ 
                    color:${appConfig.theme.colors.neutrals['000']};
                    font-size: 24px;
                    font-weight: 600;
                }
            `}</style>
        </>
    );
}

//Componente React
//Podmeos criar variaveis como tag nos componentes como Titulo
//function HomePage() {
//    return (
//        <div style={{ backgroundColor: 'black' }}>
//            <GlobalStyle />
//            <Titulo tag="h2">Boas vindas!</Titulo>
//            <h2>Discord - Alura Matrix</h2>
//       </div>
//    )
//}
//export default HomePage

export default function PaginaInicial() {
    // const username = 'StephaniHenrique';
    const [username, setUsername] = React.useState('StephaniHenrique');
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [imageVisible, setImageVisible] = React.useState(true);
    const roteamento = useRouter();

    const src = `https://api.github.com/users/${username}`;

    fetch(src)
        .then((res) => res.json())
        .then((res) => (res.id != undefined) ? setImageVisible(true) : setImageVisible(false))
        .catch((erro) => console.log(erro));


    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://funfactorpt.files.wordpress.com/2018/12/markus-detroit-become-human-2018-5g-1.jpg?w=1920&h=1080&crop=1)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        borderRadius: '5px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={function (event) {
                            event.preventDefault();
                            roteamento.push('/chat');
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Titulo tag="h2">Boas vindas de volta!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                            value={username}
                            onChange={function (event) {
                                //Onde esta o novo valor
                                const valor = event.target.value;
                                // Att o valor através do react
                                setUsername(valor);

                                setButtonDisabled((valor.length <= 2));
                                (valor.length <= 2) ? setImageVisible(false) : setImageVisible(true);
                            }}
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            disabled={buttonDisabled}
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals[999],
                            borderRadius: '10px',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >
                        <Image
                            styleSheet={{
                                borderRadius: '50%',
                                marginBottom: '16px',
                                maxWidth: '166px',
                                height: '166px',
                                objectFit: 'cover',
                            }}

                            src={imageVisible ? `https://github.com/${username}.png` : `https://www.gamespew.com/wp-content/uploads/2018/07/Detroit-Become-Human-Chloe-min.jpg`}
                        />

                        <Text
                            variant="body4"
                            styleSheet={{
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px'
                            }}
                        >
                            {imageVisible ? username : 'verifique o username'}
                        </Text>
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}