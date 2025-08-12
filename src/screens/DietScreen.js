import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DietScreen() {
  const [selectedStore, setSelectedStore] = useState('walmart');

  // Event Handlers
  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    Alert.alert('Store Selected', `You selected ${store.charAt(0).toUpperCase() + store.slice(1)}`);
  };

  const handleGenerateNewMeals = () => {
    Alert.alert('Generate Meals', 'Creating new meal plan based on your budget...');
  };

  const handleViewShoppingList = () => {
    Alert.alert('Shopping List', 'Opening your optimized shopping list...');
  };

  const handleMealPress = (mealName, price) => {
    Alert.alert('Meal Details', `${mealName}\nPrice: ${price}\n\nWould you like to see the recipe?`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Budget Section */}
        <LinearGradient
          colors={['#22c55e', '#16a34a']}
          style={styles.budgetSection}
        >
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.budgetAmount}>$150</Text>
              <Text style={styles.budgetPeriod}>Weekly Budget</Text>
            </View>
            <Text style={styles.budgetIcon}>🛒</Text>
          </View>
        </LinearGradient>

        {/* Store Selector */}
        <View style={styles.storeSelector}>
          <Text style={styles.storeTitle}>Select Your Store</Text>
          <View style={styles.storeOptions}>
            <TouchableOpacity 
              style={[
                styles.storeOption, 
                selectedStore === 'walmart' && styles.storeSelected
              ]}
              onPress={() => handleStoreSelect('walmart')}
            >
              <Text style={styles.storeIcon}>🏪</Text>
              <Text style={styles.storeLabel}>Walmart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.storeOption, 
                selectedStore === 'target' && styles.storeSelected
              ]}
              onPress={() => handleStoreSelect('target')}
            >
              <Text style={styles.storeIcon}>🎯</Text>
              <Text style={styles.storeLabel}>Target</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.storeOption, 
                selectedStore === 'kroger' && styles.storeSelected
              ]}
              onPress={() => handleStoreSelect('kroger')}
            >
              <Text style={styles.storeIcon}>🛍️</Text>
              <Text style={styles.storeLabel}>Kroger</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meal Plan */}
        <View style={styles.mealPlan}>
          <View style={styles.mealPlanHeader}>
            <Text style={styles.mealPlanTitle}>This Week's Meals</Text>
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={handleGenerateNewMeals}
            >
              <Text style={styles.generateButtonText}>Generate New</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.mealItem}
            onPress={() => handleMealPress('Chicken & Rice Bowl', '$3.25')}
          >
            <Text style={styles.mealName}>Chicken & Rice Bowl</Text>
            <Text style={styles.mealPrice}>$3.25</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mealItem}
            onPress={() => handleMealPress('Protein Smoothie', '$2.50')}
          >
            <Text style={styles.mealName}>Protein Smoothie</Text>
            <Text style={styles.mealPrice}>$2.50</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mealItem}
            onPress={() => handleMealPress('Turkey Sandwich', '$2.80')}
          >
            <Text style={styles.mealName}>Turkey Sandwich</Text>
            <Text style={styles.mealPrice}>$2.80</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mealItem}
            onPress={() => handleMealPress('Greek Yogurt & Berries', '$1.90')}
          >
            <Text style={styles.mealName}>Greek Yogurt & Berries</Text>
            <Text style={styles.mealPrice}>$1.90</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mealItem}
            onPress={() => handleMealPress('Salmon & Vegetables', '$4.50')}
          >
            <Text style={styles.mealName}>Salmon & Vegetables</Text>
            <Text style={styles.mealPrice}>$4.50</Text>
          </TouchableOpacity>
          
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total: $147.50 / $150.00</Text>
            <TouchableOpacity 
              style={styles.shoppingListButton}
              onPress={handleViewShoppingList}
            >
              <Text style={styles.shoppingListButtonText}>View Shopping List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  budgetSection: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  budgetPeriod: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  budgetIcon: {
    fontSize: 32,
  },
  storeSelector: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1e293b',
  },
  storeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  storeSelected: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  storeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  storeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  mealPlan: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  mealPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  generateButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 16,
  },
  shoppingListButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shoppingListButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
