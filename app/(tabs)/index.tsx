import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { CircularProgress } from "@/components/circular-progress";
import { useHydration } from "@/hooks/use-hydration";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const QUICK_AMOUNTS = [250, 500, 750];

export default function HomeScreen() {
  const { addWater, getTodayStats, loading } = useHydration();
  const colors = useColors();
  const todayStats = getTodayStats();

  const handleAddWater = async (amount: number) => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await addWater(amount);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-muted">Carregando...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Título */}
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">Hidrate-se</Text>
            <Text className="text-sm text-muted mt-1">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
          </View>

          {/* Indicador circular */}
          <View className="items-center py-4">
            <CircularProgress
              percentage={todayStats.percentage}
              consumed={todayStats.consumed}
              goal={todayStats.goal}
            />
          </View>

          {/* Botões rápidos */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground mb-1">
              Adicionar água
            </Text>
            <View className="flex-row gap-3">
              {QUICK_AMOUNTS.map((amount) => (
                <Pressable
                  key={amount}
                  onPress={() => handleAddWater(amount)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: colors.primary,
                      borderRadius: 12,
                      padding: 16,
                      alignItems: "center",
                      transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
                  <Text className="text-white font-semibold text-base mt-1">
                    {amount}ml
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Histórico do dia */}
          <View className="flex-1">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Hoje ({todayStats.entries.length} registros)
            </Text>
            {todayStats.entries.length === 0 ? (
              <View className="bg-surface rounded-xl p-6 items-center">
                <IconSymbol name="drop.fill" size={32} color={colors.muted} />
                <Text className="text-muted text-center mt-2">
                  Nenhum registro ainda.{"\n"}Adicione água para começar!
                </Text>
              </View>
            ) : (
              <FlatList
                data={todayStats.entries}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="bg-surface rounded-xl p-4 mb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary + "20" }}
                      >
                        <IconSymbol name="drop.fill" size={20} color={colors.primary} />
                      </View>
                      <View>
                        <Text className="text-base font-semibold text-foreground">
                          {item.amount}ml
                        </Text>
                        <Text className="text-sm text-muted">
                          {formatTime(item.timestamp)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
