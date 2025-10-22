import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useFonts, Anton_400Regular } from '@expo-google-fonts/anton';

// Define types
type MenuItem = {
  id: number;
  name: string;
  description: string;
  course: 'Starter' | 'Mains' | 'Desserts';
  price: number;
  pairing?: string;
};

type NewMenuItem = {
  name: string;
  description: string;
  course: 'Starter' | 'Mains' | 'Desserts';
  price: string;
  pairing: string;
};

type ScreenType = 'home' | 'addMenu' | 'filter';

function App() {
  // Load the Anton font
  let [fontsLoaded] = useFonts({
    Anton_400Regular,
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // tracks which screen to show
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  // stores menu items - STARTING EMPTY so chef can add items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Add Menu form
  const [newItem, setNewItem] = useState<NewMenuItem>({
    name: '',
    description: '',
    course: 'Starter',
    price: '',
    pairing: ''
  });

  // Function to add a new menu item
  const addMenuItem = (): void => {
    if (newItem.name && newItem.price) {
      const item: MenuItem = {
        id: menuItems.length + 1,
        name: newItem.name,
        description: newItem.description,
        course: newItem.course,
        price: parseFloat(newItem.price),
        pairing: newItem.pairing
      };
      setMenuItems([...menuItems, item]);
      setNewItem({ name: '', description: '', course: 'Starter', price: '', pairing: '' });
      Alert.alert('Success!', 'Menu item added successfully!');
    } else {
      Alert.alert('Error', 'Please fill in name and price');
    }
  };

  // Function to remove a menu item
  const removeMenuItem = (id: number): void => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    Alert.alert('Deleted', 'Menu item removed successfully');
  };

  // Function to calculate average price by course
  const calculateAverageByCourse = (course: string): string => {
    const courseItems = menuItems.filter(item => item.course === course);
    if (courseItems.length === 0) return '0.00';
    const total = courseItems.reduce((sum, item) => sum + item.price, 0);
    return (total / courseItems.length).toFixed(2);
  };

  // Filter menu items by course
  const [filterCourse, setFilterCourse] = useState<'All' | 'Starter' | 'Mains' | 'Desserts'>('All');
  const getFilteredItems = (): MenuItem[] => {
    if (filterCourse === 'All') return menuItems;
    return menuItems.filter(item => item.course === filterCourse);
  };

  // Wait for fonts to load
  if (!fontsLoaded) {
    return null;
  }

  // Get dynamic styles based on theme
  const themedStyles = getThemedStyles(isDarkMode);

  // HOME SCREEN
  if (currentScreen === 'home') {
    return (
      <View style={[styles.container, themedStyles.container]}>
        <ScrollView style={styles.scrollView}>
          {/* Header with Theme Toggle */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.themeToggle}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Text style={styles.themeToggleText}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            <Text style={[styles.title, themedStyles.text, { fontFamily: 'Anton_400Regular' }]}>HAPPIE</Text>
            <Text style={[styles.subtitle, themedStyles.text]}>BY CHEF CHRISTOFFEL</Text>
            <Image 
              source={require('./assets/chef.png')} 
              style={styles.chefImage}
              resizeMode="contain"
            />
          </View>

          {/* Food Images */}
          <View style={styles.imageContainer}>
            <View style={styles.imageRow}>
              <View style={[styles.imageBox, { backgroundColor: isDarkMode ? '#2D3748' : '#4A5568' }]} />
              <View style={[styles.imageBox, { backgroundColor: '#ECC94B' }]} />
              <View style={[styles.imageBox, { backgroundColor: '#4299E1' }]} />
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity style={[styles.button, themedStyles.button]}>
            <Text style={[styles.buttonText, themedStyles.buttonText]}>Vat 'n Happie</Text>
          </TouchableOpacity>

          {/* Hours */}
          <Text style={[styles.hours, themedStyles.text]}>
            MEALS AVAILABLE BETWEEN 09:00AM TILL 10:00 PM
          </Text>

          {/* Average Prices Section */}
          <View style={[styles.averageSection, themedStyles.card]}>
            <Text style={[styles.sectionTitle, themedStyles.text]}>Average Prices by Course</Text>
            <Text style={[styles.averageText, themedStyles.text]}>Starters: R{calculateAverageByCourse('Starter')}</Text>
            <Text style={[styles.averageText, themedStyles.text]}>Mains: R{calculateAverageByCourse('Mains')}</Text>
            <Text style={[styles.averageText, themedStyles.text]}>Desserts: R{calculateAverageByCourse('Desserts')}</Text>
          </View>

          {/* Total Menu Items */}
          <View style={[styles.totalSection, themedStyles.totalSection]}>
            <Text style={[styles.totalItems, themedStyles.text]}>
              Total Menu Items: {menuItems.length}
            </Text>
          </View>

          {/* Display Menu Items */}
          {menuItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, themedStyles.text]}>No menu items yet!</Text>
              <Text style={[styles.emptySubtext, themedStyles.secondaryText]}>Use "Add to Menu" to create your first dish</Text>
            </View>
          ) : (
            <View style={styles.menuPreview}>
              <Text style={[styles.menuPreviewTitle, themedStyles.text]}>Our Menu</Text>
              {(['Starter', 'Mains', 'Desserts'] as const).map((course) => {
                const courseItems = menuItems.filter(item => item.course === course);
                if (courseItems.length === 0) return null;
                
                return (
                  <View key={course}>
                    <Text style={[styles.courseTitle, themedStyles.text]}>{course}</Text>
                    {courseItems.map((item) => (
                      <View key={item.id} style={[styles.menuItemPreview, themedStyles.menuItemPreview]}>
                        <View style={styles.menuItemHeader}>
                          <Text style={[styles.menuItemName, themedStyles.text]}>{item.name}</Text>
                          <Text style={[styles.menuItemPrice, themedStyles.text]}>R{item.price}</Text>
                        </View>
                        <Text style={[styles.menuItemDescription, themedStyles.secondaryText]} numberOfLines={2}>
                          {item.description}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, themedStyles.bottomNav]}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={[styles.navText, themedStyles.text]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setCurrentScreen('addMenu')}
          >
            <Text style={styles.navIcon}>➕</Text>
            <Text style={[styles.navText, themedStyles.text]}>Add to Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setCurrentScreen('filter')}
          >
            <Text style={styles.navIcon}>🔍</Text>
            <Text style={[styles.navText, themedStyles.text]}>Filter menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ADD MENU SCREEN
  if (currentScreen === 'addMenu') {
    return (
      <View style={[styles.container, themedStyles.container]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.themeToggle}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Text style={styles.themeToggleText}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            <Text style={[styles.title, themedStyles.text, { fontFamily: 'Anton_400Regular' }]}>HAPPIE</Text>
            <Image 
              source={require('./assets/chef.png')} 
              style={styles.chefImage}
              resizeMode="contain"
            />
          </View>

          <View style={[styles.formContainer, themedStyles.card]}>
            <Text style={[styles.formTitle, themedStyles.text]}>Add Menu Item</Text>
            <Text style={[styles.formSubtitle, themedStyles.secondaryText]}>Insert Information here</Text>

            <Text style={[styles.label, themedStyles.text]}>Name of Dish</Text>
            <TextInput
              style={[styles.input, themedStyles.input]}
              placeholder="Name"
              placeholderTextColor={isDarkMode ? '#718096' : '#999'}
              value={newItem.name}
              onChangeText={(text: string) => setNewItem({...newItem, name: text})}
            />

            <Text style={[styles.label, themedStyles.text]}>Course</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={[styles.courseButton, themedStyles.courseButton, newItem.course === 'Starter' && styles.courseButtonActive]}
                onPress={() => setNewItem({...newItem, course: 'Starter'})}
              >
                <Text style={newItem.course === 'Starter' ? styles.courseSelected : [styles.courseText, themedStyles.text]}>
                  Starter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.courseButton, themedStyles.courseButton, newItem.course === 'Mains' && styles.courseButtonActive]}
                onPress={() => setNewItem({...newItem, course: 'Mains'})}
              >
                <Text style={newItem.course === 'Mains' ? styles.courseSelected : [styles.courseText, themedStyles.text]}>
                  Mains
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.courseButton, themedStyles.courseButton, newItem.course === 'Desserts' && styles.courseButtonActive]}
                onPress={() => setNewItem({...newItem, course: 'Desserts'})}
              >
                <Text style={newItem.course === 'Desserts' ? styles.courseSelected : [styles.courseText, themedStyles.text]}>
                  Desserts
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, themedStyles.text]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, themedStyles.input]}
              placeholder="Description of meals"
              placeholderTextColor={isDarkMode ? '#718096' : '#999'}
              multiline
              numberOfLines={4}
              value={newItem.description}
              onChangeText={(text: string) => setNewItem({...newItem, description: text})}
            />

            <Text style={[styles.label, themedStyles.text]}>Price</Text>
            <TextInput
              style={[styles.input, themedStyles.input]}
              placeholder="R"
              placeholderTextColor={isDarkMode ? '#718096' : '#999'}
              keyboardType="numeric"
              value={newItem.price}
              onChangeText={(text: string) => setNewItem({...newItem, price: text})}
            />

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={addMenuItem}
            >
              <Text style={styles.saveButtonText}>💾 Save your Happie</Text>
            </TouchableOpacity>

            {/* Show existing menu items with delete option */}
            <View style={styles.menuListContainer}>
              <Text style={[styles.menuListTitle, themedStyles.text]}>Current Menu Items ({menuItems.length})</Text>
              <Text style={[styles.menuListSubtitle, themedStyles.secondaryText]}>Tap ❌ to remove an item</Text>
              
              {menuItems.length === 0 ? (
                <Text style={[styles.emptyMessage, themedStyles.secondaryText]}>No menu items yet. Add your first dish above!</Text>
              ) : (
                menuItems.map((item) => (
                  <View key={item.id} style={[styles.menuListItem, themedStyles.menuListItem]}>
                    <View style={styles.menuItemInfo}>
                      <Text style={[styles.menuItemNameList, themedStyles.text]}>{item.name}</Text>
                      <Text style={[styles.menuItemCourse, themedStyles.secondaryText]}>{item.course} - R{item.price}</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => removeMenuItem(item.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>❌</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomNav, themedStyles.bottomNav]}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={[styles.navText, themedStyles.text]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navIcon}>➕</Text>
            <Text style={[styles.navText, themedStyles.text]}>Add to Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setCurrentScreen('filter')}
          >
            <Text style={styles.navIcon}>🔍</Text>
            <Text style={[styles.navText, themedStyles.text]}>Filter menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // FILTER MENU SCREEN
  if (currentScreen === 'filter') {
    return (
      <View style={[styles.container, themedStyles.container]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.themeToggle}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Text style={styles.themeToggleText}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            <Text style={[styles.title, themedStyles.text, { fontFamily: 'Anton_400Regular' }]}>HAPPIE</Text>
            <Image 
              source={require('./assets/chef.png')} 
              style={styles.chefImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.menuContainer}>
            <Text style={[styles.menuInstruction, themedStyles.secondaryText]}>Select (1) Meal from each course</Text>
            <Text style={[styles.menuTitle, themedStyles.text]}>Menu</Text>

            {/* Filter Buttons */}
            <View style={styles.filterButtons}>
              <TouchableOpacity 
                style={[styles.filterButton, themedStyles.filterButton, filterCourse === 'All' && styles.filterButtonActive]}
                onPress={() => setFilterCourse('All')}
              >
                <Text style={[styles.filterButtonText, themedStyles.text]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, themedStyles.filterButton, filterCourse === 'Starter' && styles.filterButtonActive]}
                onPress={() => setFilterCourse('Starter')}
              >
                <Text style={[styles.filterButtonText, themedStyles.text]}>Starters</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, themedStyles.filterButton, filterCourse === 'Mains' && styles.filterButtonActive]}
                onPress={() => setFilterCourse('Mains')}
              >
                <Text style={[styles.filterButtonText, themedStyles.text]}>Mains</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, themedStyles.filterButton, filterCourse === 'Desserts' && styles.filterButtonActive]}
                onPress={() => setFilterCourse('Desserts')}
              >
                <Text style={[styles.filterButtonText, themedStyles.text]}>Desserts</Text>
              </TouchableOpacity>
            </View>

            {/* Display filtered menu items */}
            {menuItems.length === 0 ? (
              <Text style={[styles.emptyMessage, themedStyles.secondaryText]}>No menu items available yet. Add some items first!</Text>
            ) : (
              (['Starter', 'Mains', 'Desserts'] as const).map((course) => {
                const courseItems = getFilteredItems().filter(item => item.course === course);
                if (courseItems.length === 0 && filterCourse !== 'All') return null;
                if (courseItems.length === 0) return (
                  <View key={course}>
                    <Text style={[styles.courseTitle, themedStyles.text]}>{course}</Text>
                    <Text style={[styles.emptyMessage, themedStyles.secondaryText]}>No {course.toLowerCase()} available.</Text>
                  </View>
                );
                
                return (
                  <View key={course}>
                    <Text style={[styles.courseTitle, themedStyles.text]}>{course}</Text>
                    <Text style={[styles.courseDescription, themedStyles.secondaryText]}>description.</Text>
                    
                    {courseItems.map((item) => (
                      <View key={item.id} style={[styles.menuItem, themedStyles.menuItem]}>
                        <View style={styles.menuItemHeader}>
                          <Text style={[styles.menuItemName, themedStyles.text]}>{item.name}</Text>
                          <Text style={[styles.menuItemPrice, themedStyles.text]}>R{item.price}</Text>
                        </View>
                        <Text style={[styles.menuItemDescription, themedStyles.secondaryText]}>{item.description}</Text>
                      </View>
                    ))}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        <View style={[styles.bottomNav, themedStyles.bottomNav]}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={[styles.navText, themedStyles.text]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setCurrentScreen('addMenu')}
          >
            <Text style={styles.navIcon}>➕</Text>
            <Text style={[styles.navText, themedStyles.text]}>Add to Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navIcon}>🔍</Text>
            <Text style={[styles.navText, themedStyles.text]}>Filter menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

// Function to get themed styles
const getThemedStyles = (isDark: boolean) => {
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#1A202C' : '#FFFFFF',
    },
    text: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    secondaryText: {
      color: isDark ? '#A0AEC0' : '#666666',
    },
    card: {
      backgroundColor: isDark ? '#2D3748' : '#FFFFFF',
      borderColor: isDark ? '#4A5568' : '#E0E0E0',
    },
    button: {
      backgroundColor: isDark ? '#4A5568' : '#E5E5E5',
    },
    buttonText: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    input: {
      backgroundColor: isDark ? '#2D3748' : '#FFFFFF',
      borderColor: isDark ? '#4A5568' : '#E0E0E0',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    courseButton: {
      backgroundColor: isDark ? '#2D3748' : '#FFFFFF',
      borderColor: isDark ? '#4A5568' : '#E0E0E0',
    },
    menuListItem: {
      backgroundColor: isDark ? '#2D3748' : '#F7FAFC',
    },
    menuItemPreview: {
      borderBottomColor: isDark ? '#4A5568' : '#E0E0E0',
    },
    menuItem: {
      borderBottomColor: isDark ? '#4A5568' : '#F0F0F0',
    },
    filterButton: {
      backgroundColor: isDark ? '#2D3748' : '#FFFFFF',
      borderColor: isDark ? '#4A5568' : '#E0E0E0',
    },
    bottomNav: {
      backgroundColor: isDark ? '#2D3748' : '#E8F5E9',
      borderTopColor: isDark ? '#4A5568' : '#E0E0E0',
    },
    totalSection: {
      backgroundColor: isDark ? '#2D3748' : '#E8F5E9',
    },
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  themeToggle: {
    position: 'absolute',
    right: 20,
    top: 0,
    padding: 10,
    zIndex: 10,
  },
  themeToggleText: {
    fontSize: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 5,
  },
  chefImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 15,
    overflow: 'hidden',
    height: 150,
  },
  imageBox: {
    flex: 1,
    marginHorizontal: 2,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
  },
  hours: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  averageSection: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  averageText: {
    fontSize: 16,
    marginVertical: 5,
  },
  totalSection: {
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  totalItems: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  menuPreview: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuPreviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItemPreview: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  navText: {
    fontSize: 10,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  courseButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  courseButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  courseText: {
    fontSize: 14,
  },
  courseSelected: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  saveButton: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  menuListContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  menuListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuListSubtitle: {
    fontSize: 12,
    marginBottom: 15,
  },
  menuListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemNameList: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemCourse: {
    fontSize: 14,
    marginTop: 5,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  menuContainer: {
    padding: 20,
  },
  menuInstruction: {
    fontSize: 12,
    marginBottom: 5,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 14,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 12,
    marginBottom: 15,
  },

menuItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 13,
    lineHeight: 20,
  },
})
