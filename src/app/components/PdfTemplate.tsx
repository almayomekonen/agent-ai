"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { OnePagerData } from "../types/onepager";

// הגדרות עיצוב
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  // כותרת עליונה
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1px solid #E0E0E0",
  },
  headerContent: {
    flex: 1,
  },
  headerLogo: {
    width: 80,
    height: 80,
    backgroundColor: "#0F3460",
    borderRadius: 8,
    position: "relative",
    marginLeft: 15,
  },
  logoTriangle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    borderStyle: "solid",
    borderWidth: 15,
    borderColor: "transparent transparent #FFFFFF transparent",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F3460",
  },
  headerDate: {
    fontSize: 10,
    color: "#777777",
    marginTop: 5,
  },
  // סקציות
  sectionContainer: {
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    textTransform: "uppercase",
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#333333",
    textAlign: "right",
  },
  // תצוגה דו-טורית
  row: {
    flexDirection: "row",
    marginVertical: 10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  mainColumn: {
    flex: 3,
    paddingRight: 15,
  },
  sideColumn: {
    flex: 2,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 10,
  },
  // גרף עוגה
  pieChart: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginVertical: 10,
  },
  // גרפים ונתונים
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginBottom: 5,
    backgroundColor: "#E6F3FF",
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 9,
    color: "#333333",
    flex: 2,
    textAlign: "right",
  },
  statValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0066CC",
    flex: 1,
    textAlign: "left",
  },
  // גרף עמודות
  barChart: {
    height: 80,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barContainer: {
    alignItems: "center",
    width: 30,
  },
  bar: {
    width: 20,
    backgroundColor: "#4D96FF",
    borderRadius: 3,
  },
  barLabel: {
    fontSize: 8,
    marginTop: 3,
    color: "#666666",
  },
  // עדויות
  testimonialBox: {
    backgroundColor: "#F0F7FF",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  testimonialText: {
    fontStyle: "italic",
    fontSize: 9,
    color: "#333333",
  },
  testimonialAuthor: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#666666",
    textAlign: "left",
    marginTop: 5,
  },
  // קריאה לפעולה
  ctaBox: {
    backgroundColor: "#0F3460",
    borderRadius: 6,
    padding: 15,
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  ctaText: {
    fontSize: 11,
    color: "white",
    lineHeight: 1.5,
  },
  // כותרת תחתונה
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#999999",
    fontSize: 8,
    paddingTop: 5,
    borderTop: "1px solid #EEEEEE",
  },
});

// סימולציה של גרף עוגה - כיוון שלא ניתן להשתמש בגרפים אמיתיים ב-@react-pdf/renderer
const PieChartPlaceholder = () => (
  <View style={styles.pieChart}>
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#E3E3E3",
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#6387EB",
        clipPath: "polygon(60px 60px, 60px 0, 120px 0, 120px 60px)",
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#4EABC8",
        clipPath: "polygon(60px 60px, 120px 60px, 120px 120px, 60px 120px)",
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#3659A6",
        clipPath: "polygon(60px 60px, 60px 120px, 0 120px, 0 60px)",
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 40,
        left: 40,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "white",
      }}
    />
  </View>
);

// סימולציה של גרף עמודות
const BarChartPlaceholder = () => (
  <View style={styles.barChart}>
    <View style={styles.barContainer}>
      <View style={[styles.bar, { height: 40 }]} />
      <Text style={styles.barLabel}>2020</Text>
    </View>
    <View style={styles.barContainer}>
      <View style={[styles.bar, { height: 60 }]} />
      <Text style={styles.barLabel}>2021</Text>
    </View>
    <View style={styles.barContainer}>
      <View style={[styles.bar, { height: 80 }]} />
      <Text style={styles.barLabel}>2022</Text>
    </View>
    <View style={styles.barContainer}>
      <View style={[styles.bar, { height: 50 }]} />
      <Text style={styles.barLabel}>2023</Text>
    </View>
  </View>
);

// קומפוננטת ה-PDF המשופרת
const PdfTemplate = ({ data }: { data: OnePagerData }) => {
  // הפקת שם המיזם מתוך תיאור המיזם (אם אפשר)
  const projectName = data.about.split(" ")[0];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* כותרת עליונה */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>One Pager</Text>
            <Text
              style={[
                styles.headerText,
                { fontSize: 18, color: "#666666", marginTop: 5 },
              ]}
            >
              {projectName}
            </Text>
            <Text style={styles.headerDate}>
              {new Date().toLocaleDateString("he-IL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.headerLogo}>
            <View style={styles.logoTriangle} />
          </View>
        </View>

        {/* חלק ראשי - תצוגה דו-טורית */}
        <View style={styles.row}>
          {/* עמודה ימנית - מידע עיקרי */}
          <View style={styles.mainColumn}>
            {/* אודות */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#4D96FF" }]}
                />
                <Text style={styles.sectionTitle}>אודות</Text>
              </View>
              <Text style={styles.sectionContent}>{data.about}</Text>
            </View>

            {/* משימה וחזון */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#6C63FF" }]}
                />
                <Text style={styles.sectionTitle}>משימה</Text>
              </View>
              <Text style={styles.sectionContent}>{data.mission}</Text>
            </View>

            {/* ערכים */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#F87E7B" }]}
                />
                <Text style={styles.sectionTitle}>ערכים</Text>
              </View>
              <Text style={styles.sectionContent}>{data.values}</Text>
            </View>

            {/* הישגים עם גרף עמודות */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#5CB8B2" }]}
                />
                <Text style={styles.sectionTitle}>הישגים</Text>
              </View>
              <BarChartPlaceholder />
              <Text style={styles.sectionContent}>{data.achievements}</Text>
            </View>
          </View>

          {/* עמודה שמאלית - נתונים וסטטיסטיקה */}
          <View style={styles.sideColumn}>
            {/* נתונים פיננסיים */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#4CAF50" }]}
                />
                <Text style={styles.sectionTitle}>נתונים פיננסיים</Text>
              </View>
              <PieChartPlaceholder />
              <Text
                style={[
                  styles.sectionContent,
                  {
                    fontSize: 9,
                    textAlign: "center",
                    color: "#666666",
                    marginTop: -5,
                    marginBottom: 10,
                  },
                ]}
              >
                התפלגות הכנסות
              </Text>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>הכנסה שנתית:</Text>
                <Text style={styles.statValue}>₪1.2M</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>צמיחה שנתית:</Text>
                <Text style={styles.statValue}>24%</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>מספר לקוחות:</Text>
                <Text style={styles.statValue}>45+</Text>
              </View>
              <Text
                style={[styles.sectionContent, { fontSize: 9, marginTop: 8 }]}
              >
                {data.financial}
              </Text>
            </View>

            {/* עדויות לקוחות */}
            <View style={[styles.sectionContainer, { marginTop: 15 }]}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#9C27B0" }]}
                />
                <Text style={styles.sectionTitle}>עדויות לקוחות</Text>
              </View>
              <View style={styles.testimonialBox}>
                <Text style={styles.testimonialText}>
                  &lsquo;המוצר שלכם חסך לנו זמן יקר ושיפר את היעילות שלנו
                  ב-30%.&lsquo;
                </Text>
                <Text style={styles.testimonialAuthor}>- לקוח א&lsquo;</Text>
              </View>
              <View style={styles.testimonialBox}>
                <Text style={styles.testimonialText}>
                  &lsquo;הפתרון החדשני שלכם פתר בעיה שהתמודדנו איתה במשך
                  שנים.&lsquo;
                </Text>
                <Text style={styles.testimonialAuthor}>- לקוח ב&lsquo;</Text>
              </View>
            </View>
          </View>
        </View>

        {/* קריאה לפעולה */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>הצעד הבא</Text>
          <Text style={styles.ctaText}>{data.callToAction}</Text>
        </View>

        {/* כותרת תחתונה */}
        <View style={styles.footer}>
          <Text>
            המסמך נוצר באופן אוטומטי ע&quot;י סוכן AI מדבר | כל הזכויות שמורות ©{" "}
            {new Date().getFullYear()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplate;
