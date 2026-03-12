import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';

interface CardProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string | ReactNode;
  variant?: 'default' | 'outline' | 'filled' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  shadow?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  header?: ReactNode;
  footer?: ReactNode;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  size = 'medium',
  onPress,
  style,
  contentStyle,
  titleStyle,
  subtitleStyle,
  disabled = false,
  shadow = true,
  borderColor,
  backgroundColor,
  padding,
  margin,
  borderRadius,
  header,
  footer,
  badge,
  badgeColor,
  badgeTextColor,
  loading = false,
  error = false,
  errorMessage = 'Error loading content',
}) => {
  // Get styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: backgroundColor || COLORS.white,
          borderWidth: 2,
          borderColor: borderColor || COLORS.primary,
        };
      case 'filled':
        return {
          backgroundColor: backgroundColor || COLORS.primary + '10',
          borderWidth: 0,
        };
      case 'elevated':
        return {
          backgroundColor: backgroundColor || COLORS.white,
          borderWidth: 0,
          elevation: 8,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        };
      default:
        return {
          backgroundColor: backgroundColor || COLORS.white,
          borderWidth: 1,
          borderColor: borderColor || COLORS.lightGray,
        };
    }
  };

  // Get size-based padding
  const getSizePadding = () => {
    switch (size) {
      case 'small':
        return padding || 12;
      case 'large':
        return padding || 24;
      default:
        return padding || 16;
    }
  };

  // Get size-based title font size
  const getTitleSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  // Get size-based subtitle font size
  const getSubtitleSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 14;
      default:
        return 12;
    }
  };

  const variantStyles = getVariantStyles();
  const cardPadding = getSizePadding();
  const titleSize = getTitleSize();
  const subtitleSize = getSubtitleSize();

  const cardStyles = [
    styles.card,
    variantStyles,
    shadow && styles.shadow,
    {
      padding: cardPadding,
      margin: margin || 0,
      borderRadius: borderRadius || 12,
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return (
        <View style={[
          styles.iconContainer,
          variant === 'filled' && { backgroundColor: COLORS.primary + '30' }
        ]}>
          <Feather 
            name={icon as any} 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            color={variant === 'filled' ? COLORS.primary : COLORS.content}
          />
        </View>
      );
    }

    return icon;
  };

  const renderHeader = () => {
    if (header) return header;

    if (!title && !subtitle && !icon && !badge) return null;

    return (
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          {renderIcon()}
          <View style={styles.textContainer}>
            {title && (
              <Text style={[
                styles.title,
                { fontSize: titleSize },
                titleStyle,
              ]}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[
                styles.subtitle,
                { fontSize: subtitleSize },
                subtitleStyle,
              ]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {badge && (
          <View style={[
            styles.badge,
            { backgroundColor: badgeColor || COLORS.primary }
          ]}>
            <Text style={[
              styles.badgeText,
              { color: badgeTextColor || COLORS.white }
            ]}>
              {badge}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={20} color={COLORS.error} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      );
    }

    return children;
  };

  const CardContent = () => (
    <View style={contentStyle}>
      {renderHeader()}
      {renderContent()}
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.tertiary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.gray,
    lineHeight: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default Card;