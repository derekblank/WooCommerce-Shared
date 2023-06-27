import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchShippingZones, ShippingZone } from "./API/ShippingZoneAPI";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "./Navigation/NavigationRoutes";
import ToolbarActionButton from "./ToolbarActionButton";

type RowProps = {
  title: string;
  body: string;
  caption: string;
};

function Row(props: RowProps): JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.row.title}> {props.title} </Text>
      <Text style={styles.row.body}> {props.body} </Text>
      <Text style={styles.row.caption}> {props.caption} </Text>
    </View>
  );
}

const ShippingZonesList = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<ShippingZone[]>([]);

  /*
   * Shows an alert that allows the user to retry the fetch operation.
   */
  const showRetryAlert = () => {
    Alert.alert(
      "",
      "There was an error loading shipping zones, pleae try again later.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Retry", onPress: () => fetchData() },
      ]
    );
  };

  /*
   * Fetches the neccessary data for the shipping zones list.
   * If the operation fails, a retry alert is shown.
   */
  const fetchData = async () => {
    setLoading(true);

    try {
      const zones = await fetchShippingZones();
      setData(zones);
    } catch (error) {
      console.log(error);
      showRetryAlert();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ToolbarActionButton
          label={"Add"}
          onPress={() => navigation.navigate(NavigationRoutes.AddShippingZone)}
        />
      ),
    });
  }, [navigation]);

  const separator = () => (
    <View
      style={{
        backgroundColor: "#CED0CE",
        height: 0.5,
        marginLeft: 16,
      }}
    />
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <SafeAreaView>
          <ActivityIndicator />
        </SafeAreaView>
      ) : (
        <FlatList
          ItemSeparatorComponent={separator}
          contentInsetAdjustmentBehavior="always"
          style={styles.list}
          data={data}
          renderItem={({ item }) => (
            <Row
              title={item.title}
              body={item.locations.map((location) => location.code).join(", ")}
              caption={item.methods.map((method) => method.title).join(", ")}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    //backgroundColor: "rgb(246, 247, 247)",
    backgroundColor: "white",
  },
  row: {
    padding: 0,
    fontSize: 23,
    borderRadius: 0,
    backgroundColor: "white",
    margin: 16,
    title: {
      fontFamily: "System",
      fontSize: 17,
      marginBottom: 4,
      color: "rgb(0, 0, 0)",
    },
    body: {
      fontFamily: "System",
      fontSize: 15,
      color: "rgba(0, 0, 0, 0.6)",
    },
    caption: {
      fontFamily: "System",
      fontSize: 15,
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
});
export default ShippingZonesList;
