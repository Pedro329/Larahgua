import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useColors } from "@/hooks/use-colors";
import { useEffect } from "react";

interface CircularProgressProps {
  percentage: number;
  consumed: number;
  goal: number;
  size?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function CircularProgress({
  percentage,
  consumed,
  goal,
  size = 200,
}: CircularProgressProps) {
  const colors = useColors();
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - progress.value * circumference;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        {/* Círculo de fundo */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Círculo de progresso animado */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View className="items-center">
        <Text className="text-3xl font-bold text-foreground">
          {consumed}ml
        </Text>
        <Text className="text-sm text-muted">de {goal}ml</Text>
        <Text className="text-lg font-semibold text-primary mt-1">
          {percentage}%
        </Text>
      </View>
    </View>
  );
}
