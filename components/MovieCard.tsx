import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export interface Movie {
  id: string;
  title: string; 
  director: string;
  year: number;
  rating: number;
  poster: string;
  watched: boolean;
}
export interface MovieCardProps {
  movie: Movie;
  onSelect: (id: string) => void;
  layout?: "row" | "poster";
}
function MovieCard({ movie, onSelect, layout = "row" }: MovieCardProps) {
  const rating = Number(movie.rating).toFixed(1);
  const imageSource = movie.poster ? { uri: movie.poster } : undefined;

    if (layout === "poster") {
    return (
      <Pressable style={styles.posterWrapper} onPress={() => onSelect(movie.id)}>
        <View style={styles.posterCard}>
          <View>
            <Image source={imageSource} style={styles.posterImage} />
            <View style={styles.ratingBadge}>
              <Text style={styles.badgeText}>⭐ {rating}</Text>
            </View>
            {movie.watched && (
              <View style={styles.watchedChip}>
                <Text style={styles.badgeText}>✓ Đã xem</Text>
              </View>
            )}
          </View>
          <Text style={styles.posterTitle} numberOfLines={2}>
            {movie.title}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.rowWrapper} onPress={() => onSelect(movie.id)}>
      <View style={styles.rowCard}>
        <Image source={imageSource} style={styles.rowImage} />
        <View style={styles.rowInfo}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.subtitle}>
            {movie.director} · {movie.year}
          </Text>
          <Text style={styles.rating}>⭐ {rating}</Text>
          <Text style={styles.status}>
            {movie.watched ? "✅ Đã xem" : "🎬 Chưa xem"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
export default React.memo(MovieCard);
const styles = StyleSheet.create({
  rowWrapper: { paddingHorizontal: 6, paddingVertical: 6 },
  rowCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  rowImage: {
    width: 70,
    height: 105,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
  },
  rowInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: { fontSize: 15, fontWeight: "bold", color: "#1e293b", marginBottom: 2 },
  subtitle: { fontSize: 12, color: "#64748b", marginBottom: 2 },
  rating: { fontSize: 13, color: "#b45309", marginBottom: 2 },
  status: { fontSize: 12, color: "#000" },

  posterWrapper: { flex: 1, maxWidth: "50%", padding: 6 },
  posterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
  },
  posterImage: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
  },
  posterTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  ratingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  watchedChip: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "#27ae60",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
});
