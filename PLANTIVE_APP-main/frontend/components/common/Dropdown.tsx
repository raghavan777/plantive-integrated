import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  Animated,
  StyleProp,
  TextStyle,
  ViewStyle,
  Platform,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  hint?: string;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  selectedValues?: string[];
  onMultipleValueChange?: (values: string[]) => void;
  style?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  selectedItemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  iconSize?: number;
  required?: boolean;
  showRequiredIndicator?: boolean;
  zIndex?: number;
  maxHeight?: number;
  minHeight?: number;
  animationDuration?: number;
  searchPlaceholder?: string;
  noResultsText?: string;
  loading?: boolean;
  loadingText?: string;
  renderItem?: (item: DropdownItem, isSelected: boolean) => React.ReactNode;
  renderSelectedItem?: (item: DropdownItem) => React.ReactNode;
  renderLeftIcon?: () => React.ReactNode;
  renderRightIcon?: (isOpen: boolean) => React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  value,
  onValueChange,
  placeholder = 'Select an option',
  placeholderTextColor = COLORS.gray,
  label,
  error,
  disabled = false,
  searchable = false,
  multiple = false,
  selectedValues = [],
  onMultipleValueChange,
  style,
  dropdownStyle,
  itemStyle,
  selectedItemStyle,
  textStyle,
  selectedTextStyle,
  placeholderStyle,
  labelStyle,
  errorStyle,
  iconColor = COLORS.gray,
  iconSize = 20,
  required = false,
  showRequiredIndicator = true,
  zIndex = 1000,
  maxHeight = 250,
  minHeight = 40,
  animationDuration = 200,
  searchPlaceholder = 'Search...',
  noResultsText = 'No results found',
  loading = false,
  loadingText = 'Loading...',
  renderItem,
  renderSelectedItem,
  renderLeftIcon,
  renderRightIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const selectedItem = items.find(item => item.value === value);
  const selectedItems = items.filter(item => selectedValues.includes(item.value));

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      measureDropdownPosition();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Rotate arrow animation
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const measureDropdownPosition = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow((x, y, width, height) => {
        const screenHeight = Dimensions.get('window').height;
        const dropdownHeight = Math.min(maxHeight, filteredItems.length * 50 + (searchable ? 50 : 0));
        const spaceBelow = screenHeight - y - height;
        const spaceAbove = y;
        
        // Decide if dropdown should open above or below
        const opensDown = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove;
        
        setDropdownPosition({
          top: opensDown ? y + height : y - dropdownHeight,
          left: x,
          width: width,
        });
      });
    }
  };

  const handleSelect = (itemValue: string) => {
    if (disabled || items.find(item => item.value === itemValue)?.disabled) return;

    if (multiple) {
      const newValues = selectedValues.includes(itemValue)
        ? selectedValues.filter(v => v !== itemValue)
        : [...selectedValues, itemValue];
      onMultipleValueChange?.(newValues);
    } else {
      onValueChange?.(itemValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = () => {
    if (multiple) {
      onMultipleValueChange?.([]);
    } else {
      onValueChange?.('');
    }
  };

  const renderDefaultItem = (item: DropdownItem, isSelected: boolean) => {
    const itemStyles = [
      styles.item,
      itemStyle,
      isSelected && [styles.selectedItem, selectedItemStyle],
      item.disabled && styles.disabledItem,
    ];

    const textStyles = [
      styles.itemText,
      textStyle,
      isSelected && [styles.selectedItemText, selectedTextStyle],
      item.disabled && styles.disabledText,
    ];

    return (
      <View style={itemStyles}>
        {item.icon && (
          <Feather
            name={item.icon as any}
            size={18}
            color={isSelected ? COLORS.primary : COLORS.gray}
            style={styles.itemIcon}
          />
        )}
        <View style={styles.itemContent}>
          <Text style={textStyles} numberOfLines={1}>
            {item.label}
          </Text>
          {item.hint && (
            <Text style={styles.itemHint}>{item.hint}</Text>
          )}
        </View>
        {isSelected && (
          <Feather
            name="check"
            size={18}
            color={COLORS.primary}
          />
        )}
      </View>
    );
  };

  const renderDefaultSelected = () => {
    if (multiple && selectedItems.length > 0) {
      return (
        <View style={styles.multipleSelection}>
          <Text style={[styles.selectedText, selectedTextStyle, textStyle]}>
            {selectedItems.length} selected
          </Text>
        </View>
      );
    }

    if (selectedItem) {
      if (renderSelectedItem) {
        return renderSelectedItem(selectedItem);
      }
      return (
        <Text style={[styles.selectedText, selectedTextStyle, textStyle]}>
          {selectedItem.label}
        </Text>
      );
    }

    return (
      <Text style={[
        styles.placeholder,
        { color: placeholderTextColor },
        placeholderStyle,
        textStyle,
      ]}>
        {placeholder}
      </Text>
    );
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, { zIndex }, style]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
          {required && showRequiredIndicator && (
            <Text style={styles.requiredIndicator}>*</Text>
          )}
        </View>
      )}

      {/* Dropdown Trigger */}
      <TouchableOpacity
        ref={dropdownRef}
        style={[
          styles.dropdownTrigger,
          { minHeight },
          disabled && styles.disabledTrigger,
          error && styles.errorTrigger,
          isOpen && styles.openTrigger,
        ]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {/* Left Icon */}
        <View style={styles.leftContent}>
          {renderLeftIcon ? renderLeftIcon() : null}
          {renderDefaultSelected()}
        </View>

        {/* Right Icons */}
        <View style={styles.rightContent}>
          {(multiple ? selectedItems.length > 0 : selectedItem) && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name="x-circle"
                size={16}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          )}
          {renderRightIcon ? (
            renderRightIcon(isOpen)
          ) : (
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <Feather
                name="chevron-down"
                size={iconSize}
                color={iconColor}
              />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <Animated.View
            style={[
              styles.dropdownContainer,
              dropdownStyle,
              {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
              Platform.OS === 'ios' && {
                shadowColor: COLORS.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
              },
            ]}
          >
            {/* Search Input */}
            {searchable && (
              <View style={styles.searchContainer}>
                <Feather
                  name="search"
                  size={18}
                  color={COLORS.gray}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={COLORS.gray}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Feather name="x" size={18} color={COLORS.gray} />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {/* Loading State */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>{loadingText}</Text>
              </View>
            ) : (
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const isSelected = multiple
                    ? selectedValues.includes(item.value)
                    : value === item.value;
                  return (
                    <TouchableOpacity
                      onPress={() => handleSelect(item.value)}
                      disabled={item.disabled}
                    >
                      {renderItem
                        ? renderItem(item, isSelected)
                        : renderDefaultItem(item, isSelected)}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Feather name="search" size={24} color={COLORS.gray} />
                    <Text style={styles.emptyText}>{noResultsText}</Text>
                  </View>
                }
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}

            {/* Multiple Selection Summary */}
            {multiple && selectedItems.length > 0 && (
              <View style={styles.selectionSummary}>
                <Text style={styles.summaryText}>
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
  },
  requiredIndicator: {
    color: COLORS.error,
    marginLeft: 4,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  disabledTrigger: {
    backgroundColor: COLORS.background,
    opacity: 0.6,
  },
  errorTrigger: {
    borderColor: COLORS.error,
  },
  openTrigger: {
    borderColor: COLORS.primary,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    padding: 2,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.content,
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    flex: 1,
  },
  multipleSelection: {
    flex: 1,
  },
  error: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.content,
    padding: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray + '30',
  },
  selectedItem: {
    backgroundColor: COLORS.primary + '10',
  },
  disabledItem: {
    opacity: 0.5,
  },
  itemContent: {
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.content,
  },
  selectedItemText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  disabledText: {
    color: COLORS.gray,
  },
  itemHint: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.content,
  },
  doneText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default Dropdown;