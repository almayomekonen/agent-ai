"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { OnePagerData } from "@/app/types/onepager";
import Image from "next/image";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
  },

  header: {
    backgroundColor: "#1E40AF",
    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
    padding: 40,
    color: "#FFFFFF",
    textAlign: "center",
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },

  headerSubtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    fontWeight: "normal",
  },

  statsBar: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 20,
    justifyContent: "space-around",
    borderBottom: "3px solid #E2E8F0",
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statIcon: {
    fontSize: 20,
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  statValue: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "bold",
  },

  body: {
    padding: 30,
    flex: 1,
  },

  contentGrid: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },

  leftColumn: {
    flex: 2,
    gap: 20,
  },

  rightColumn: {
    flex: 1,
    gap: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #E2E8F0",
    marginBottom: 15,
  },

  cardPrimary: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    borderLeft: "5px solid #3B82F6",
    marginBottom: 15,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },

  cardSuccess: {
    backgroundColor: "#F0FDF4",
    padding: 20,
    borderRadius: 12,
    borderLeft: "5px solid #059669",
    marginBottom: 15,
  },

  cardWarning: {
    backgroundColor: "#FFFBEB",
    padding: 20,
    borderRadius: 12,
    borderLeft: "5px solid #D97706",
    marginBottom: 15,
  },

  cardCTA: {
    backgroundColor: "#FEF2F2",
    padding: 20,
    borderRadius: 12,
    border: "2px solid #EF4444",
    textAlign: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionIcon: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    fontSize: 12,
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
    minWidth: 30,
    textAlign: "center",
  },

  sectionIconGreen: {
    backgroundColor: "#059669",
    color: "#FFFFFF",
    fontSize: 12,
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
    minWidth: 30,
    textAlign: "center",
  },

  sectionIconOrange: {
    backgroundColor: "#D97706",
    color: "#FFFFFF",
    fontSize: 12,
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
    minWidth: 30,
    textAlign: "center",
  },

  sectionIconRed: {
    backgroundColor: "#EF4444",
    color: "#FFFFFF",
    fontSize: 12,
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
    minWidth: 30,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
  },

  contentText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: "#374151",
    textAlign: "right",
  },

  ctaButton: {
    backgroundColor: "#EF4444",
    color: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8FAFC",
    borderTop: "1px solid #E2E8F0",
    marginTop: "auto",
  },

  footerText: {
    fontSize: 10,
    color: "#64748B",
  },

  footerBrand: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3B82F6",
  },
});

interface PdfTemplateProps {
  data: OnePagerData;
}

// פונקציה לתרגום כותרות
const getHebrewTitle = (key: string): string => {
  const translations: Record<string, string> = {
    about: "אודות המיזם",
    mission: "חזון ומטרה",
    values: "ערכי הליבה",
    financial: "המודל העסקי",
    achievements: "הישגים עיקריים",
    callToAction: "הזמנה לפעולה",
  };
  return translations[key] || key;
};

// פונקציה לבחירת סגנון לפי מפתח
const getCardStyle = (key: string) => {
  switch (key) {
    case "about":
      return styles.cardPrimary;
    case "mission":
      return styles.cardPrimary;
    case "values":
      return styles.cardSuccess;
    case "financial":
      return styles.cardSuccess;
    case "achievements":
      return styles.cardWarning;
    case "callToAction":
      return styles.cardCTA;
    default:
      return styles.card;
  }
};

// פונקציה לבחירת איקון לפי מפתח
const getSectionIcon = (key: string) => {
  switch (key) {
    case "about":
      return { icon: "📄", style: styles.sectionIcon };
    case "mission":
      return { icon: "🎯", style: styles.sectionIcon };
    case "values":
      return { icon: "⚡", style: styles.sectionIconGreen };
    case "financial":
      return { icon: "💰", style: styles.sectionIconGreen };
    case "achievements":
      return { icon: "🏆", style: styles.sectionIconOrange };
    case "callToAction":
      return { icon: "🚀", style: styles.sectionIconRed };
    default:
      return { icon: "📋", style: styles.sectionIcon };
  }
};

const PdfTemplate = ({ data }: PdfTemplateProps) => {
  const currentDate = new Date().toLocaleDateString("he-IL");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              padding: 15,
              borderRadius: 12,
              alignSelf: "center",
              marginBottom: 15,
            }}
          >
            <Image
              alt="methodian logo"
              src="/methodian.png"
              width={150}
              height={150}
              style={{
                alignSelf: "center",
              }}
            />
          </View>
          <Text style={styles.headerTitle}>One Pager יזמי 🚀</Text>
          <Text style={styles.headerSubtitle}>תמצית אסטרטגית מקצועית</Text>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statLabel}>מודל עסקי</Text>
            <Text style={styles.statValue}>מוגדר</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statLabel}>חזון</Text>
            <Text style={styles.statValue}>ברור</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statLabel}>הישגים</Text>
            <Text style={styles.statValue}>מתועדים</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statLabel}>מוכנות</Text>
            <Text style={styles.statValue}>לקדימה</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.contentGrid}>
            <View style={styles.leftColumn}>
              {data.about && (
                <View style={getCardStyle("about")}>
                  <View style={styles.sectionHeader}>
                    <Text style={getSectionIcon("about").style}>
                      {getSectionIcon("about").icon}
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {getHebrewTitle("about")}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>{data.about}</Text>
                </View>
              )}

              {data.mission && (
                <View style={getCardStyle("mission")}>
                  <View style={styles.sectionHeader}>
                    <Text style={getSectionIcon("mission").style}>
                      {getSectionIcon("mission").icon}
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {getHebrewTitle("mission")}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>{data.mission}</Text>
                </View>
              )}

              {data.financial && (
                <View style={getCardStyle("financial")}>
                  <View style={styles.sectionHeader}>
                    <Text style={getSectionIcon("financial").style}>
                      {getSectionIcon("financial").icon}
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {getHebrewTitle("financial")}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>{data.financial}</Text>
                </View>
              )}
            </View>

            <View style={styles.rightColumn}>
              {data.values && (
                <View style={getCardStyle("values")}>
                  <View style={styles.sectionHeader}>
                    <Text style={getSectionIcon("values").style}>
                      {getSectionIcon("values").icon}
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {getHebrewTitle("values")}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>{data.values}</Text>
                </View>
              )}

              {data.achievements && (
                <View style={getCardStyle("achievements")}>
                  <View style={styles.sectionHeader}>
                    <Text style={getSectionIcon("achievements").style}>
                      {getSectionIcon("achievements").icon}
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {getHebrewTitle("achievements")}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>{data.achievements}</Text>
                </View>
              )}

              {data.callToAction && (
                <View style={getCardStyle("callToAction")}>
                  <View style={styles.sectionHeader}>
                    <Text style={getSectionIcon("callToAction").style}>
                      {getSectionIcon("callToAction").icon}
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {getHebrewTitle("callToAction")}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>{data.callToAction}</Text>
                  <View style={styles.ctaButton}>
                    <Text>📧 צור קשר עכשיו</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>נוצר בתאריך: {currentDate}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              padding: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "rgba(59, 130, 246, 0.2)",
            }}
          >
            <Image
              alt="methodian logo"
              src="/methodian.png"
              width={60}
              height={60}
              style={{
                width: 60,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                ...styles.footerBrand,
                fontSize: 14,
                letterSpacing: 0.5,
              }}
            >
              Methodian AI
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplate;
