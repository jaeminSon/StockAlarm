import React, { useEffect, useState, useRef } from "react";
import { ScrollView, View, Text, Dimensions, StyleSheet } from "react-native";
import { fetchChartData } from "../api";
import CustomGauger from "../component/Gauger";
import LineGraph from "../component/LineChart";
import CustomBack from "../component/BackButton";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

export default function MainScreen({ route }: any) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const paddingBottom = screenHeight / 5;
  const paddingLeft = screenWidth / 20;

  const styles = StyleSheet.create({
    button: {
      flex: 1,
      padding: paddingLeft,
      paddingBottom: paddingBottom,
    },
  });

  const { ticker, window } = route.params;
  const [data, setData] = useState<any>(null);

  const adUnitId = TestIds.ADAPTIVE_BANNER;
  const bannerRef = useRef<BannerAd>(null);

  useEffect(() => {
    fetchChartData(ticker, window).then(setData);
  }, [ticker, window]);

  if (!data) {
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>Loading...</Text>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <LineGraph
        x={data.date}
        y={data.price_ratio}
        title={`${data.ticker} (${data.date[data.date.length - 1]})`}
        ylabel={`Price / ${data.window}-MA`}
      />
      <CustomGauger
        leftColor="#00ee00"
        leftText="Undervalued"
        rightColor="#ee0000"
        rightText="Overvalued"
        title="Closing Price"
        percentile={data.price_ratio_percentile}
      />
      <CustomGauger
        leftColor="#aaaaee"
        leftText="Low-volume"
        rightColor="#0000ee"
        rightText="High-volume"
        title="Volume"
        percentile={data.volume_percentile}
      />
      <View style={styles.button}>
        <CustomBack />
      </View>
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </ScrollView>
  );
}
