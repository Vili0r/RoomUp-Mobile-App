import { Picker, PickerItem } from "react-native-woodpicker";
import { ViewStyle, View, StyleSheet, Platform, Text } from "react-native";

const Select = ({
  label,
  value,
  items,
  onItemChange,
  style,
  isNullable,
  error,
  errorText,
  placeholder,
  onClose,
}) => {
  return (
    <View style={style}>
      <Text appearance={"hint"} category={"c1"} className="mb-2 text-gray-700">
        {label}
      </Text>
      <Picker
        item={value}
        items={items}
        onItemChange={onItemChange}
        onClose={onClose}
        placeholder={placeholder ? placeholder : "Select"}
        isNullable={isNullable}
        containerStyle={[
          styles.container,
          {
            borderColor: error ? ["#f15c5c"] : ["#ebcfcf"],
          },
        ]}
        textInputStyle={styles.textInput}
      />
      {error ? (
        <Text category="c1" style={styles.errorText}>
          {errorText ? errorText : "Required"}
        </Text>
      ) : null}
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  textInput: {
    marginLeft: 15,
    marginTop: 5,
  },
  errorText: { color: "#f15c5c" },
});
