type CourseProgressProps = {
  courses: {
    id: string;
    title: string;
    instructor: string;
    thumbnailUrl: string;
    progress: number;
    totalLectures: number;
    completedLectures: number;
  }[];
};

const CourseProgress = ({ courses }: CourseProgressProps) => {
  return (
    <div className="bg-card-bg rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-6">Your Course Progress</h2>
      
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-col md:flex-row md:items-center gap-4">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full md:w-40 h-24 object-cover rounded-md"
            />
            
            <div className="flex-1">
              <h3 className="font-medium mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Instructor: {course.instructor}
              </p>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">
                  {course.completedLectures} of {course.totalLectures} lectures completed
                </span>
                <span className="text-sm font-medium">
                  {course.progress}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
            
            <button className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition whitespace-nowrap">
              Continue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;