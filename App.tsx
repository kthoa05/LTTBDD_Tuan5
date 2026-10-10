import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View, Switch, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from "react";

import MovieCard, { Movie } from './components/MovieCard';

export const API_URL = "https://6aca1f343115bcc958206738.mockapi.io/api/movies/movies";

export async function fetchMovies() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Gọi API thất bại: " + res.status);
  }
  return res.json();
}
 
export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [refreshing, setRefreshing] = useState(false);
  
  const [posterMode, setPosterMode] = useState(false);
  const [onlyUnwatched, setOnlyUnwatched] = useState(false);
  
  const visibleMovies = useMemo(
    () => (onlyUnwatched ? movies.filter((m) => !m.watched) : movies),
    [movies, onlyUnwatched]
  );

  // Cập nhật hàm loadMovies: Nhận tham số isRefresh để điều khiển vòng xoay chính xác (Câu 6)
  const loadMovies = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true); // Bật hiệu ứng kéo làm mới
      } else {
        setLoading(true); // Bật hiệu ứng loading màn hình chính
      }
      setError(null);
      const data = await fetchMovies();
      setMovies(data);
    } catch (err: any) {
      setError(err.message || "Không tải được danh sách phim.");
    } finally {
      // Đảm bảo vòng xoay luôn được tắt ở khối finally kể cả khi có lỗi xảy ra (Câu 6)
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleSelect = useCallback((id: string) => {
    setMovies((currentMovies) => {
      const movie = currentMovies.find((m) => m.id === id);
      if (movie) {
        Alert.alert(movie.title, `Đạo diễn: ${movie.director}`);
      }
      return currentMovies;
    });
  }, []); 

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        
        {/* Phần Đầu Màn Hình chứa tiêu đề và hai công tắc */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Movie Watchlist</Text>
          
          <View style={styles.switchContainer}>
            {/* Công tắc 1: Dạng poster */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Dạng poster</Text>
              <Switch
                value={posterMode}
                onValueChange={(value) => setPosterMode(value)}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={posterMode ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>

            {/* Công tắc 2: Chưa xem */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Chưa xem</Text>
              <Switch
                value={onlyUnwatched}
                onValueChange={(value) => setOnlyUnwatched(value)}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={onlyUnwatched ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" style={styles.center} color="#0000ff" />
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="Thử lại" onPress={() => loadMovies(false)} color="red" />
            </View>
          ) : (
            <FlatList
              key={posterMode ? "grid" : "list"}
              data={visibleMovies}
              keyExtractor={(item) => item.id}
              numColumns={posterMode ? 2 : 1}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <MovieCard 
                  movie={item} 
                  onSelect={handleSelect} 
                  layout={posterMode ? "poster" : "row"} 
                />
              )}
              // 1. Tích hợp tính năng kéo làm mới (Câu 6)
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => loadMovies(true)} // Gọi API làm mới danh sách dữ liệu
                  colors={["#0000ff"]} // Màu sắc vòng xoay trên Android
                  tintColor="#0000ff" // Màu sắc vòng xoay trên iOS
                />
              }
              // 2. Giao diện trống khi bộ lọc không khớp với kết quả nào (Câu 6)
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Không có phim nào để hiển thị.</Text>
                </View>
              }
            />
          )}
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', 
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    gap: 12 
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 6,
    flexGrow: 1, 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
});
