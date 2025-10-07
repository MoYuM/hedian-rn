import { IconSymbol } from '@/components/ui/IconSymbol';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Tabs, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const showActionSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleCreateCocktail = () => {
    bottomSheetModalRef.current?.dismiss();
    router.push('/(tabs)/create');
  };

  const handleAddIngredient = () => {
    bottomSheetModalRef.current?.dismiss();
    router.push('/add-ingredient' as any);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={() => bottomSheetModalRef.current?.dismiss()}
      />
    ),
    []
  );

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '首页',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} color={color} name="menubar.home" />
            ),
          }}
        />
        <Tabs.Screen
          listeners={({ navigation }) => {
            return {
              tabPress: e => {
                e.preventDefault();
                showActionSheet();
              },
            };
          }}
          name="create"
          options={{
            title: '创建',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} color={color} name="menubar.plus" />
            ),
          }}
        />
        <Tabs.Screen
          name="mine"
          options={{
            title: '我的',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} color={color} name="menubar.mine" />
            ),
          }}
        />
      </Tabs>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        // snapPoints={['50%']}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <Text style={styles.bottomSheetTitle}>选择操作</Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={handleCreateCocktail}
            >
              <IconSymbol size={24} color="#6366f1" name="menubar.plus" />
              <Text style={styles.listItemText}>创建鸡尾酒</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItem}
              onPress={handleAddIngredient}
            >
              <IconSymbol size={24} color="#10b981" name="inbox" />
              <Text style={styles.listItemText}>添加材料</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.listItem, styles.cancelItem]}
              onPress={() => bottomSheetModalRef.current?.dismiss()}
            >
              <IconSymbol size={24} color="#ef4444" name="close" />
              <Text style={[styles.listItemText, styles.cancelText]}>取消</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#e0e0e0',
    width: 40,
  },
  bottomSheetContent: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'left',
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2c2c2e',
    marginLeft: 16,
  },
  cancelItem: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fed7d7',
    marginTop: 8,
    marginBottom: 0,
  },
  cancelText: {
    color: '#e53e3e',
    fontWeight: '600',
  },
});
