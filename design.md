# Design do Aplicativo - Lembrete de Água

## Visão Geral
Aplicativo mobile para Android focado em ajudar usuários a manterem-se hidratados através de lembretes, acompanhamento de consumo e notificações personalizadas.

## Orientação e Uso
- **Orientação**: Portrait (9:16) - uso com uma mão
- **Plataforma principal**: Android (com suporte a APK)
- **Estilo**: iOS Human Interface Guidelines (HIG) - aparência nativa e profissional

## Lista de Telas

### 1. Home (Tela Principal)
**Conteúdo**:
- Indicador visual circular de progresso (mostra % da meta diária alcançada)
- Meta diária em ml (ex: 2000ml)
- Quantidade consumida hoje em ml
- Botões rápidos para adicionar água (+250ml, +500ml, +750ml)
- Histórico do dia (lista de registros com horário)

**Funcionalidade**:
- Adicionar consumo de água rapidamente
- Visualizar progresso em tempo real
- Ver histórico de consumo do dia

### 2. Configurações
**Conteúdo**:
- Campo para definir meta diária (ml)
- Intervalo entre lembretes (minutos)
- Horário de início dos lembretes
- Horário de término dos lembretes
- Toggle para ativar/desativar notificações
- Toggle para ativar/desativar som de alarme
- Botão para resetar dados

**Funcionalidade**:
- Personalizar meta de hidratação
- Configurar frequência e horários de lembretes
- Controlar notificações e alarmes

### 3. Histórico
**Conteúdo**:
- Lista de dias anteriores
- Para cada dia: data, meta, quantidade consumida, % alcançado
- Gráfico semanal de consumo

**Funcionalidade**:
- Visualizar histórico de hidratação
- Acompanhar tendências semanais

## Fluxos Principais de Usuário

### Fluxo 1: Primeiro Uso
1. Usuário abre app pela primeira vez
2. Tela Home mostra meta padrão (2000ml)
3. Usuário toca em "Configurações" no tab bar
4. Define sua meta personalizada e horários de lembrete
5. Volta para Home e começa a registrar consumo

### Fluxo 2: Registrar Consumo de Água
1. Usuário está na tela Home
2. Toca em um dos botões rápidos (+250ml, +500ml, +750ml)
3. Feedback visual: animação no indicador circular
4. Feedback háptico leve
5. Novo registro aparece no histórico do dia

### Fluxo 3: Receber Lembrete
1. App envia notificação no horário programado
2. Notificação mostra: "Hora de beber água! 💧"
3. Usuário toca na notificação
4. App abre na tela Home
5. Usuário registra consumo

### Fluxo 4: Visualizar Progresso
1. Usuário abre tab "Histórico"
2. Vê lista de dias anteriores com estatísticas
3. Rola para baixo para ver gráfico semanal
4. Toca em um dia específico para ver detalhes

## Escolhas de Cores

### Paleta Principal
- **Primary (Azul Água)**: `#1E90FF` (light) / `#4A9EFF` (dark)
  - Usado para: indicador de progresso, botões principais, ícones ativos
- **Background**: `#FFFFFF` (light) / `#151718` (dark)
- **Surface**: `#F0F8FF` (light) / `#1E2022` (dark)
  - Usado para: cards, botões secundários
- **Foreground**: `#11181C` (light) / `#ECEDEE` (dark)
- **Muted**: `#687076` (light) / `#9BA1A6` (dark)
- **Success (Verde)**: `#22C55E` (light) / `#4ADE80` (dark)
  - Usado quando meta diária é atingida
- **Border**: `#E0F2FF` (light) / `#334155` (dark)

### Aplicação Visual
- Indicador circular: gradiente de azul claro para azul intenso conforme progresso
- Botões de ação: fundo azul primary com texto branco
- Cards de histórico: fundo surface com bordas sutis
- Ícones: azul primary quando ativos, muted quando inativos

## Componentes Chave

### Indicador Circular de Progresso
- Anel circular com animação suave
- Centro mostra: quantidade consumida / meta
- Percentual abaixo em texto menor
- Animação ao adicionar água

### Botões de Quantidade Rápida
- Três botões horizontais
- Ícone de copo + quantidade em ml
- Feedback visual ao pressionar (scale 0.97)
- Haptic feedback leve

### Card de Histórico
- Data e dia da semana
- Barra de progresso horizontal
- Quantidade consumida vs meta
- Ícone de check verde se meta atingida

## Ícones Necessários
- `water-drop` / `droplet`: ícone principal do app
- `notifications` / `bell.fill`: para configurações de lembrete
- `chart-bar` / `chart.bar.fill`: para histórico
- `settings` / `gear`: para configurações
- `add` / `plus.circle.fill`: para adicionar água
- `check-circle` / `checkmark.circle.fill`: para meta atingida

## Armazenamento de Dados
- **Local (AsyncStorage)**: todas as configurações e histórico
- Não requer autenticação de usuário
- Não requer sincronização na nuvem
- Dados persistem localmente no dispositivo
