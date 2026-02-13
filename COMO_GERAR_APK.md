# Como Gerar o APK do Aplicativo Hidrate-se

Este documento explica como gerar o arquivo APK do aplicativo para instalação em dispositivos Android.

## Pré-requisitos

Para gerar o APK, você precisa ter instalado:
- Node.js (versão 18 ou superior)
- EAS CLI (Expo Application Services)

## Opção 1: Gerar APK via EAS Build (Recomendado)

Esta é a forma mais simples e recomendada para gerar o APK.

### Passo 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

### Passo 2: Login no Expo

```bash
eas login
```

Se você não tem uma conta Expo, crie uma em https://expo.dev/signup

### Passo 3: Configurar o projeto

```bash
cd /home/ubuntu/hydration-reminder
eas build:configure
```

### Passo 4: Gerar o APK

Para gerar um APK de desenvolvimento (preview):

```bash
eas build -p android --profile preview
```

Para gerar um APK de produção:

```bash
eas build -p android --profile production
```

O processo levará alguns minutos. Quando concluído, você receberá um link para baixar o APK.

## Opção 2: Gerar APK Localmente

Se preferir gerar o APK localmente, você precisará ter o Android Studio instalado.

### Passo 1: Instalar dependências

```bash
cd /home/ubuntu/hydration-reminder
pnpm install
```

### Passo 2: Gerar o APK local

```bash
npx expo run:android --variant release
```

O APK será gerado em:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Instalando o APK no Dispositivo

### Via USB

1. Conecte seu dispositivo Android ao computador via USB
2. Ative a "Depuração USB" nas configurações de desenvolvedor do Android
3. Execute:
```bash
adb install caminho/para/o/app.apk
```

### Via Download Direto

1. Transfira o arquivo APK para o dispositivo (via e-mail, Google Drive, etc.)
2. No dispositivo, abra o arquivo APK
3. Permita a instalação de fontes desconhecidas quando solicitado
4. Siga as instruções na tela para instalar

## Testando o Aplicativo

Após instalar o APK:

1. Abra o aplicativo "Hidrate-se"
2. Configure sua meta diária de água
3. Configure os horários de lembrete
4. Ative as notificações quando solicitado
5. Teste adicionando água usando os botões rápidos
6. Verifique se as notificações estão funcionando

## Permissões Necessárias

O aplicativo solicita as seguintes permissões:

- **Notificações**: Para enviar lembretes de hidratação
- **Armazenamento**: Para salvar seus dados localmente

## Solução de Problemas

### Notificações não aparecem

1. Verifique se as notificações estão ativadas nas configurações do app
2. Nas configurações do Android, verifique se o app tem permissão para notificações
3. Certifique-se de que o modo "Não perturbe" não está ativo

### APK não instala

1. Verifique se você permitiu instalação de fontes desconhecidas
2. Certifique-se de que há espaço suficiente no dispositivo
3. Tente desinstalar versões anteriores do app antes de instalar

## Recursos Adicionais

- Documentação do Expo: https://docs.expo.dev/
- EAS Build: https://docs.expo.dev/build/introduction/
- Expo Application Services: https://expo.dev/eas

## Suporte

Para problemas ou dúvidas sobre o aplicativo, consulte a documentação do Expo ou abra uma issue no repositório do projeto.
