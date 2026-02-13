import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useHydration } from "@/hooks/use-hydration";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HistoryScreen() {
  const { getWeeklyStats } = useHydration();
  const colors = useColors();
  const weeklyStats = getWeeklyStats();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { weekday: "short" });
  };

  const maxConsumed = Math.max(...weeklyStats.map((s) => s.consumed), 1);

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          <Text className="text-2xl font-bold text-foreground">Histórico</Text>

          {/* Gráfico semanal */}
          <View className="bg-surface rounded-xl p-4 gap-3">
            <Text className="text-base font-semibold text-foreground">Últimos 7 dias</Text>
            <View className="flex-row items-end justify-between h-40 gap-2">
              {weeklyStats.map((stat) => {
                const barHeight = (stat.consumed / maxConsumed) * 100;
                const isGoalMet = stat.percentage >= 100;

                return (
                  <View key={stat.date} className="flex-1 items-center gap-2">
                    <View className="flex-1 w-full justify-end">
                      <View
                        style={{
                          height: `${Math.max(barHeight, 5)}%`,
                          backgroundColor: isGoalMet ? colors.success : colors.primary,
                          borderRadius: 6,
                        }}
                      />
                    </View>
                    <Text className="text-xs text-muted">{getDayName(stat.date)}</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      {formatDate(stat.date)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Lista de dias */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-foreground mb-1">Detalhes</Text>
            {weeklyStats
              .slice()
              .reverse()
              .map((stat) => {
                const isGoalMet = stat.percentage >= 100;
                const date = new Date(stat.date);
                const isToday =
                  date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];

                return (
                  <View key={stat.date} className="bg-surface rounded-xl p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-2">
                        <IconSymbol
                          name={isGoalMet ? "checkmark.circle.fill" : "drop.fill"}
                          size={20}
                          color={isGoalMet ? colors.success : colors.primary}
                        />
                        <Text className="text-base font-semibold text-foreground">
                          {isToday
                            ? "Hoje"
                            : date.toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "numeric",
                                month: "short",
                              })}
                        </Text>
                      </View>
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: isGoalMet ? colors.success : colors.muted }}
                      >
                        {stat.percentage}%
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-muted">
                        {stat.consumed}ml de {stat.goal}ml
                      </Text>
                      <Text className="text-xs text-muted">{stat.entries.length} registros</Text>
                    </View>

                    {/* Barra de progresso */}
                    <View className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                      <View
                        style={{
                          width: `${Math.min(stat.percentage, 100)}%`,
                          height: "100%",
                          backgroundColor: isGoalMet ? colors.success : colors.primary,
                          borderRadius: 9999,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
