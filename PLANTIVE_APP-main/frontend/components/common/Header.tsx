import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: string | ReactNode;
  rightIcon?: string | ReactNode;
  rightIcons?: Array<string | ReactNode>;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onRightIconPress?: (index: number) => void;
  variant?: 'default' | 'transparent' | 'gradient' | 'colored';
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  iconColor?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  customLeftComponent?: ReactNode;
  customRightComponent?: ReactNode;
  customCenterComponent?: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  safeArea?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  statusBarColor?: string;
  elevation?: number;
  shadow?: boolean;
  borderBottom?: boolean;
  borderBottomColor?: string;
  borderBottomWidth?: number;
  titleAlignment?: 'left' | 'center';
  maxTitleLines?: number;
  showStatusBar?: boolean;
  notchPadding?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  rightIcons = [],
  onLeftPress,
  onRightPress,
  onRightIconPress,
  variant = 'default',
  backgroundColor,
  titleColor,
  subtitleColor,
  iconColor,
  showBackButton = true,
  backButtonText,
  customLeftComponent,
  customRightComponent,
  customCenterComponent,
  style,
  titleStyle,
  subtitleStyle,
  safeArea = true,
  statusBarStyle = 'light-content',
  statusBarColor,
  elevation = 4,
  shadow = true,
  borderBottom = true,
  borderBottomColor = COLORS.lightGray,
  borderBottomWidth = 1,
  titleAlignment = 'center',
  maxTitleLines = 1,
  showStatusBar = true,
  notchPadding = true,
}) => {
  const router = useRouter();

  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    switch (variant) {
      case 'transparent':
        return 'transparent';
      case 'gradient':
        return COLORS.primary;
      case 'colored':
        return COLORS.primary;
      default:
        return COLORS.white;
    }
  };

  const getTitleColor = () => {
    if (titleColor) return titleColor;
    switch (variant) {
      case 'gradient':
      case 'colored':
        return COLORS.white;
      default:
        return COLORS.content;
    }
  };

  const getSubtitleColor = () => {
    if (subtitleColor) return subtitleColor;
    switch (variant) {
      case 'gradient':
      case 'colored':
        return COLORS.white + 'CC';
      default:
        return COLORS.gray;
    }
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    switch (variant) {
      case 'gradient':
      case 'colored':
        return COLORS.white;
      default:
        return COLORS.content;
    }
  };

  const getStatusBarColor = () => {
    if (statusBarColor) return statusBarColor;
    if (variant === 'transparent') return 'transparent';
    return getBackgroundColor();
  };

  const handleBackPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/auth/splash');
      }
    }
  };

  const renderLeftIcon = () => {
    if (customLeftComponent) return customLeftComponent;

    const shouldShowBack = showBackButton && (router.canGoBack() || onLeftPress);
    
    if (!shouldShowBack && !leftIcon) return <View style={styles.emptySpace} />;

    const iconColorValue = getIconColor();

    return (
      <TouchableOpacity
        style={styles.leftContainer}
        onPress={handleBackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {leftIcon ? (
          typeof leftIcon === 'string' ? (
            <Feather name={leftIcon as any} size={24} color={iconColorValue} />
          ) : (
            leftIcon
          )
        ) : (
          <>
            <Feather name="chevron-left" size={24} color={iconColorValue} />
            {backButtonText && (
              <Text style={[styles.backText, { color: iconColorValue }]}>
                {backButtonText}
              </Text>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  const renderRightIcons = () => {
    if (customRightComponent) return customRightComponent;

    const icons = rightIcons.length > 0 ? rightIcons : rightIcon ? [rightIcon] : [];

    if (icons.length === 0) return <View style={styles.emptySpace} />;

    const iconColorValue = getIconColor();

    return (
      <View style={styles.rightContainer}>
        {icons.map((icon, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.rightIconButton,
              index > 0 && { marginLeft: 12 }
            ]}
            onPress={() => {
              if (icons.length === 1 && onRightPress) {
                onRightPress();
              } else if (onRightIconPress) {
                onRightIconPress(index);
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {typeof icon === 'string' ? (
              <Feather name={icon as any} size={22} color={iconColorValue} />
            ) : (
              icon
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCenterContent = () => {
    if (customCenterComponent) return customCenterComponent;

    if (!title && !subtitle) return null;

    const titleColorValue = getTitleColor();
    const subtitleColorValue = getSubtitleColor();

    return (
      <View style={[
        styles.centerContainer,
        titleAlignment === 'left' && styles.centerContainerLeft,
      ]}>
        {title && (
          <Text
            style={[
              styles.title,
              { color: titleColorValue },
              titleStyle,
            ]}
            numberOfLines={maxTitleLines}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: subtitleColorValue },
              subtitleStyle,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };

  const containerStyles = [
    styles.container,
    {
      backgroundColor: getBackgroundColor(),
      elevation: shadow ? elevation : 0,
      shadowOpacity: shadow ? 0.1 : 0,
      borderBottomWidth: borderBottom ? borderBottomWidth : 0,
      borderBottomColor: borderBottomColor,
    },
    variant === 'gradient' && styles.gradientBackground,
    style,
  ];

  const HeaderContent = () => (
    <View style={[
      styles.content,
      notchPadding && Platform.OS === 'ios' && { paddingTop: 10 }
    ]}>
      {renderLeftIcon()}
      {renderCenterContent()}
      {renderRightIcons()}
    </View>
  );

  return (
    <>
      {/* Status Bar */}
      {showStatusBar && Platform.OS === 'android' && (
        <StatusBar
          backgroundColor={getStatusBarColor()}
          barStyle={statusBarStyle}
          translucent={variant === 'transparent'}
        />
      )}

      {/* Safe Area Wrapper */}
      {safeArea ? (
        <SafeAreaView style={containerStyles}>
          <HeaderContent />
        </SafeAreaView>
      ) : (
        <View style={containerStyles}>
          <HeaderContent />
        </View>
      )}

      {/* iOS Status Bar Spacer */}
      {showStatusBar && Platform.OS === 'ios' && variant !== 'transparent' && (
        <View style={[styles.iosStatusBar, { backgroundColor: getStatusBarColor() }]} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 100,
  },
  gradientBackground: {
    backgroundColor: COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  centerContainerLeft: {
    alignItems: 'flex-start',
    marginLeft: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
  },
  rightIconButton: {
    padding: 4,
  },
  emptySpace: {
    width: 44,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  iosStatusBar: {
    height: Platform.OS === 'ios' ? 44 : 0,
    width: '100%',
  },
});

export default Header;