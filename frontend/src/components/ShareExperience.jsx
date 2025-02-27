import React from "react";
import { useNavigate } from "react-router-dom";

const ShareExperience = () => {   

  const navigate = useNavigate(); 
  // Data for the cards
  const cards = [
    {
      id: 1,
      image: "https://media.geeksforgeeks.org/contest/InterviewExperience220241104144126.png",
      title: "Interview Experience",
      description:
        "Your 15 mins can help someone to get a job. Share your brief interview experience here.",
      link: "/posts-new?cid=e8fc46fe-75e7-4a4b-be3c-0c862d655ed0",
    },
    {
      id: 2,
      image: "https://media.geeksforgeeks.org/contest/AdmissionExperiences120240424160607.png",
      title: "Admission Experience",
      description:
        "Share your admission experience at a college or university. Your experience can work as a guide and assist other aspirants in their application process.",
      link: "/posts-new?cid=82536bdb-84e6-4661-87c3-e77c3ac04ede",
    },
    {
      id: 3,
      image: "https://media.geeksforgeeks.org/contest/WorkExperiences120240424161138.png",
      title: "Work Experience",
      description:
        "Share your work experience with your current or previous organizations. Your experience might help others to choose an organization fit for them.",
      link: "/posts-new?cid=22ae3354-15b6-4dd4-a5b4-5c7a105b8a8f",
    },
    {
      id: 4,
      image: "https://media.geeksforgeeks.org/contest/CareerJourneys20240514133407.png",
      title: "Career Journey",
      description:
        "Share your career journey, write about the path you followed to get into your desired profession, and help students with similar dreams in career navigation.",
      link: "/posts-new?cid=5219b0b2-7671-40a0-9bda-503e28a61c31",
    },
    {
      id: 5,
      image: "https://media.geeksforgeeks.org/contest/CampusExperiences120240424161254.png",
      title: "Campus Experience",
      description:
        "Share your college Campus Experience. Write about its environment, culture, placement, hackathon, fest, etc., and give our readers useful insights.",
      link: "/posts-new?cid=c5e1ac90-9490-440a-a5fa-6180c87ab8ae",
    },
    {
      id: 6,
      image: "https://media.geeksforgeeks.org/contest/EngineeringExamExperiences120240424161326.png",
      title: "Engineering Exam Experience",
      description:
        "Share your Engineering entrance exam or preparation experience for JEE Main, JEE Advance, State Engineering Exams, or other exams and help the aspirants know better.",
      link: "/posts-new?cid=fbed2543-6e40-4f77-b460-e962cc55c315",
    },
    {
      id: 7,
      image: "https://media.geeksforgeeks.org/contest/Asset2020240424161520.png",
      title: "Coaching Experience",
      description:
        "Share your Coaching Experience, Write about the environment, culture, learning curve, etc. at IIT JEE, UPSC, SSC, or any other Coaching Institute and help aspiring students.",
      link: "/posts-new?cid=c68c1296-a16f-420b-b9c9-90aac9d924f6",
    },
    {
      id: 8,
      image: "https://media.geeksforgeeks.org/contest/CompetitiveExamExperiences120240425145020.png",
      title: "Competitive Exam Experience",
      description:
        "Share your competitive exam or preparation experience and help other aspirants achieve their goals. It could be any competitive exam like GATE, CAT, Banking, SSC, UPSC, or other govt. exams, etc.",
      link: "/posts-new?cid=5ebb8fe9-b980-4891-af07-f2d62a9735f2",
    },
    {
      id: 9,
      image: "https://media.geeksforgeeks.org/contest/Coursesreview20241220120217.png",
      title: "Course Review",
      description:
        "Share your thoughts about a course you attended or covered. Write about what you liked, how it helped you, and any tips for future learners. Your review can guide others in choosing the right course for their goals.",
      link: "/posts-new?cid=f255850b-a127-4266-bf8a-d80aea06de70",
    },
  ];

  return ( 
    <>
    <div className="h-full w-full p-20 shadow-sm bg-gray-50">    
      <h2 className="text-2xl font-bold mb-8 pt-3">Share your Experience</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">      
        {cards.map((card) => (
          <a
            key={card.id}
            onClick={()=>navigate('/write',{state:{id:card.id}})}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 size-80 h-60 hover:-translate-y-1 cursor-pointer"
          >
            <div className="overflow-hidden rounded-t-lg">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-20 object-cover" // Medium image height
              />
            </div>
            <div className="p-3"> {/* Medium padding */}
              <p className="text-md text-gray-700">{card.description}</p> {/* Smaller text with relaxed line height */}
            </div>
          </a>
        ))}
      </div>
    </div> 
    </> 
  );
};

export default ShareExperience;