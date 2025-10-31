import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters with at least one number, one uppercase and one lowercase letter
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with at least one number, one uppercase and one lowercase letter';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to register the user
      // For demo purposes, we'll just store the user data locally
      await AsyncStorage.setItem('userToken', 'dummy-token');
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userEmail', email);
      
      // Show success message
      Alert.alert(
        'Account Created',
        'Your account has been successfully created!',
        [
          { text: 'OK', onPress: () => navigation.replace('Main') }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Signup failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Join Campus Connect</Text>
        <Text style={styles.subtitle}>Create your account to get started</Text>
        
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              accessibilityLabel="Full name input"
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              accessibilityLabel="Email input"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="newPassword"
              accessibilityLabel="Password input"
            />
            <TouchableOpacity 
              style={styles.visibilityToggle}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#94a3b8" 
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoComplete="password"
              textContentType="newPassword"
              accessibilityLabel="Confirm password input"
            />
            <TouchableOpacity 
              style={styles.visibilityToggle}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#94a3b8" 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>
        
        <View style={styles.termsContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            accessibilityLabel={agreeToTerms ? "Uncheck terms and conditions" : "Check terms and conditions"}
          >
            <Ionicons 
              name={agreeToTerms ? "checkmark-square" : "square-outline"} 
              size={22} 
              color={agreeToTerms ? "#6366f1" : "#94a3b8"} 
            />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink} onPress={() => Alert.alert('Terms of Service', 'Terms of Service content goes here')}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text style={styles.termsLink} onPress={() => Alert.alert('Privacy Policy', 'Privacy Policy content goes here')}>
              Privacy Policy
            </Text>
          </Text>
        </View>
        {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
        
        <TouchableOpacity 
          style={[styles.signupButton, isLoading && styles.disabledButton]} 
          onPress={handleSignup}
          disabled={isLoading}
          accessibilityLabel="Sign up button"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 5,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 50,
    marginBottom: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  visibilityToggle: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
  termsLink: {
    color: '#6366f1',
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#6366f1',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#a5b4fc',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#64748b',
    fontSize: 16,
  },
  loginLink: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
