// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { db } from "@/lib/firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// // 포지션 목록
// const positions = [
//     "Worship Leader",
//     "Lead Synth",
//     "Aux Synth",
//     "Bass Guitar",
//     "Electric Guitar",
//     "Acoustic Guitar",
//     "Drum",
//     "Sound Engineer",
//     "Singer 1",
//     "Singer 2",
//     "Singer 3",
//     "Singer 4",
// ];

// // 현재 달의 주일 날짜 생성
// const getSundaysInCurrentMonth = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth();

//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);

//     const sundays = [];

//     // 첫 번째 일요일 찾기
//     let day = firstDay;
//     while (day.getDay() !== 0) {
//         day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
//     }

//     // 이번 달의 모든 일요일 추가
//     while (day <= lastDay) {
//         sundays.push(new Date(day));
//         day = new Date(day.getTime() + 7 * 24 * 60 * 60 * 1000);
//     }

//     return sundays;
// };

// export default function WorshipSchedule() {
//     const { data: session } = useSession();
//     const [sundays, setSundays] = useState<Date[]>([]);
//     const [schedule, setSchedule] = useState<Record<string, Record<string, string>>>({});
//     const [loading, setLoading] = useState(true);
//     const [selectedSunday, setSelectedSunday] = useState<Date | null>(null);
//     const [playlistUrl, setPlaylistUrl] = useState<Record<string, string>>({});
//     const [newPlaylistUrl, setNewPlaylistUrl] = useState("");
//     const [isLeader, setIsLeader] = useState(false);

//     useEffect(() => {
//         setSundays(getSundaysInCurrentMonth());
//         if (sundays.length > 0) {
//             setSelectedSunday(sundays[0]);
//         }
//     }, []);

//     useEffect(() => {
//         const checkIfLeader = async () => {
//             if (!session?.user?.email) return;

//             try {
//                 const leaderDoc = await getDoc(doc(db, "roles", "worship_leader"));
//                 if (leaderDoc.exists()) {
//                     const leaderEmails = leaderDoc.data().emails || [];
//                     setIsLeader(leaderEmails.includes(session.user.email));
//                 }
//             } catch (error) {
//                 console.error("Error checking leader role:", error);
//             }
//         };

//         checkIfLeader();
//     }, [session]);

//     useEffect(() => {
//         const fetchSchedule = async () => {
//             if (sundays.length === 0) return;

//             setLoading(true);
//             try {
//                 const monthYear = `${sundays[0].getFullYear()}-${sundays[0].getMonth() + 1}`;
//                 const scheduleDoc = await getDoc(doc(db, "worship_schedule", monthYear));

//                 if (scheduleDoc.exists()) {
//                     setSchedule(scheduleDoc.data().schedule || {});
//                     setPlaylistUrl(scheduleDoc.data().playlists || {});
//                 } else {
//                     // 새 문서 생성
//                     const newSchedule: Record<string, Record<string, string>> = {};
//                     const newPlaylists: Record<string, string> = {};

//                     sundays.forEach((sunday) => {
//                         const dateStr = sunday.toISOString().split("T")[0];
//                         newSchedule[dateStr] = {};
//                         newPlaylists[dateStr] = "";
//                     });

//                     setSchedule(newSchedule);
//                     setPlaylistUrl(newPlaylists);

//                     // Firestore에 초기 문서 생성
//                     await setDoc(doc(db, "worship_schedule", monthYear), {
//                         schedule: newSchedule,
//                         playlists: newPlaylists,
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching schedule:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSchedule();
//     }, [sundays]);

//     const handlePositionToggle = async (date: string, position: string) => {
//         if (!session?.user?.email) return;

//         const newSchedule = { ...schedule };

//         if (!newSchedule[date]) {
//             newSchedule[date] = {};
//         }

//         // 이미 해당 포지션에 내가 있으면 제거, 아니면 추가
//         if (newSchedule[date][position] === session.user.email) {
//             delete newSchedule[date][position];
//         } else {
//             newSchedule[date][position] = session.user.email;
//         }

//         setSchedule(newSchedule);

//         // Firestore 업데이트
//         try {
//             const monthYear = `${sundays[0].getFullYear()}-${sundays[0].getMonth() + 1}`;
//             await setDoc(
//                 doc(db, "worship_schedule", monthYear),
//                 {
//                     schedule: newSchedule,
//                     playlists: playlistUrl,
//                 },
//                 { merge: true }
//             );
//         } catch (error) {
//             console.error("Error updating schedule:", error);
//         }
//     };

//     const handlePlaylistUpdate = async () => {
//         if (!selectedSunday || !isLeader) return;

//         const dateStr = selectedSunday.toISOString().split("T")[0];
//         const newPlaylistUrls = { ...playlistUrl };
//         newPlaylistUrls[dateStr] = newPlaylistUrl;

//         setPlaylistUrl(newPlaylistUrls);
//         setNewPlaylistUrl("");

//         // Firestore 업데이트
//         try {
//             const monthYear = `${selectedSunday.getFullYear()}-${selectedSunday.getMonth() + 1}`;
//             await setDoc(
//                 doc(db, "worship_schedule", monthYear),
//                 {
//                     schedule,
//                     playlists: newPlaylistUrls,
//                 },
//                 { merge: true }
//             );
//         } catch (error) {
//             console.error("Error updating playlist:", error);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* 월간 일정 제목 */}
//             <h2 className="text-xl font-semibold text-gray-800">
//                 {sundays.length > 0
//                     ? `${sundays[0].getFullYear()}년 ${sundays[0].getMonth() + 1}월 찬양팀 일정`
//                     : "로딩 중..."}
//             </h2>

//             {/* 주일 선택 탭 */}
//             <div className="flex flex-wrap gap-2">
//                 {sundays.map((sunday) => (
//                     <button
//                         key={sunday.toISOString()}
//                         onClick={() => setSelectedSunday(sunday)}
//                         className={`px-3 py-2 text-sm rounded-md ${
//                             selectedSunday && sunday.toISOString() === selectedSunday.toISOString()
//                                 ? "bg-indigo-600 text-white"
//                                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                         {sunday.getDate()}일
//                     </button>
//                 ))}
//             </div>

//             {selectedSunday && (
//                 <>
//                     {/* 선택된 주일 정보 */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h3 className="font-medium text-gray-900">
//                             {selectedSunday.toLocaleDateString("ko-KR", {
//                                 year: "numeric",
//                                 month: "long",
//                                 day: "numeric",
//                             })}{" "}
//                             주일
//                         </h3>

//                         {/* 플레이리스트 URL (인도자만 편집 가능) */}
//                         <div className="mt-4">
//                             <h4 className="text-sm font-medium text-gray-700">찬양 플레이리스트</h4>
//                             {playlistUrl[selectedSunday.toISOString().split("T")[0]] ? (
//                                 <div className="mt-2">
//                                     <a
//                                         href={
//                                             playlistUrl[selectedSunday.toISOString().split("T")[0]]
//                                         }
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-indigo-600 hover:text-indigo-800 text-sm"
//                                     >
//                                         플레이리스트 보기 →
//                                     </a>
//                                 </div>
//                             ) : (
//                                 <p className="text-sm text-gray-500 mt-2">
//                                     등록된 플레이리스트가 없습니다.
//                                 </p>
//                             )}

//                             {isLeader && (
//                                 <div className="mt-3 flex flex-col sm:flex-row gap-2">
//                                     <input
//                                         type="text"
//                                         value={newPlaylistUrl}
//                                         onChange={(e) => setNewPlaylistUrl(e.target.value)}
//                                         placeholder="Google 플레이리스트 URL 입력"
//                                         className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                                     />
//                                     <button
//                                         onClick={handlePlaylistUpdate}
//                                         className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                                     >
//                                         저장
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* 포지션 선택 */}
//                     <div className="mt-6">
//                         <h3 className="text-lg font-medium text-gray-900 mb-4">포지션 선택</h3>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {positions.map((position) => {
//                                 const dateStr = selectedSunday.toISOString().split("T")[0];
//                                 const isSelected =
//                                     schedule[dateStr]?.[position] === session?.user?.email;
//                                 const isTaken = schedule[dateStr]?.[position] && !isSelected;

//                                 return (
//                                     <div
//                                         key={position}
//                                         className={`p-4 rounded-lg border ${
//                                             isSelected
//                                                 ? "border-indigo-500 bg-indigo-50"
//                                                 : isTaken
//                                                 ? "border-gray-300 bg-gray-50"
//                                                 : "border-gray-200 hover:border-gray-300"
//                                         }`}
//                                     >
//                                         <div className="flex justify-between items-center">
//                                             <span className="font-medium">{position}</span>
//                                             {isTaken ? (
//                                                 <span className="text-sm text-gray-500">
//                                                     이미 선택됨
//                                                 </span>
//                                             ) : (
//                                                 <button
//                                                     onClick={() =>
//                                                         handlePositionToggle(dateStr, position)
//                                                     }
//                                                     disabled={!session}
//                                                     className={`px-3 py-1 text-xs rounded-full ${
//                                                         isSelected
//                                                             ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                                                             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                                                     }`}
//                                                 >
//                                                     {isSelected ? "취소" : "선택"}
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }
