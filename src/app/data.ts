import Papa from "papaparse";
import { Doctor } from "../../types";

const SHEET_ID = "1C2TSME8WcmcRpGXkKbGAkBgXS_7VAmSSCg6WfiJh_O8";
const GID = "799451496";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export async function getDoctorsData(): Promise<Doctor[]> {
  try {
    const response = await fetch(CSV_URL, { next: { revalidate: 3600 } });
    const csvData = await response.text();

    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    // Simple Sentiment Analysis for Recommendations
    const analyzeSentiment = (text: string): number => {
      if (!text) return 0;
      const posWords = ["ভালো", "চমৎকার", "আস্থাশীল", "সফল", "ধন্যবাদ", "good", "great", "excellent", "safe", "সন্তুষ্ট"];
      const negWords = ["খারাপ", "অসন্তুষ্ট", "ব্যথা", "bad", "unhappy", "pain", "সমস্যা"];
      
      let score = 0;
      const words = text.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (posWords.some(pw => word.includes(pw))) score += 1;
        if (negWords.some(nw => word.includes(nw))) score -= 1;
      });
      return score;
    };

    // Map the raw Google Sheet rows to our Doctor interface.
    // This safely checks for common column name variations, including Bengali ones.
    const validDoctors: Doctor[] = (parsed.data as any[]).map((row) => {
      const name = row["ডাক্তারের নাম:"] || row["Name"] || row["Doctor Name"] || "";
      const district = row["আপনার জেলা:"] || row["District"] || "";
      const address = row["ডাক্তারের চেম্বার এড্রেস:"] || row["Location"] || row["Address"] || "";
      
      // Construct Location by combining District and Address if available
      const location = [district, address].filter(Boolean).join(", ");
      
      const vbac = row["উনি কি ভিব্যাক(সিজারের পর নরমাল ডেলিভারি)  করান? "] || row["vbac"] || "No info";
      const purdah = row["আপনার উল্লিখিত ডাক্তার কি পর্দার ব্যাপারে সহযোগী?"] || row["purdah"] || "No info";
      const interventions = row["এই ডাক্তার কি মেডিকেল হস্তক্ষেপ (নিয়মমাফিক সব মাকে পিটোসিন, এপিসিওটমি দেয়া) সহ নরমাল ডেলিভারি করান নাকি আপডেটেড গাইডলাইন অনুযায়ী শুধু প্রয়োজন হলেই এসব ব্যবহার করেন? "] || row["interventions"] || "No info";
      const presence = row["আপনার নরমাল ডেলিভারির সময় কি ডাক্তার নিজে উপস্থিত ছিলেন? সব রোগীর ক্ষেত্রেই কি থাকেন?"] || row["presence"] || "No info";
      
      // Use the 'Presence' or other descriptive column as Feedback if specific feedback column is missing
      const feedbackText = row["আপনার উল্লিখিত ডাক্তার সম্পর্কে আপনার ফিডব্যাক:"] || row["Feedback"] || presence || "";
      const sentimentScore = analyzeSentiment(feedbackText);

      return {
        Name: name,
        Specialty: "Obstetrics & Gynecology", // Default since it's a delivery directory
        Location: location,
        Phone: row["Phone"] || row["ফোন নাম্বার"] || "",
        Email: row["Email"] || row["ইমেইল"] || "",
        Vbac: vbac,
        Purdah: purdah,
        Interventions: interventions,
        Presence: presence,
        Feedback: feedbackText,
        SentimentScore: sentimentScore,
      };
    }).filter(doc => doc.Name && doc.Name.length > 0);

    return validDoctors;
  } catch (error) {
    console.error("Error fetching doctors from GSheet:", error);
    return [];
  }
}
