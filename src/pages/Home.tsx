import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            중학교 2학년 평면도형 정당화 도구
          </h1>
          <p className="text-xl text-gray-600">
            기하학의 증명 과정을 시각적으로 체험해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/isosceles"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">이등변삼각형</h3>
              <p className="text-gray-600 mb-4">
                이등변삼각형의 성질을 증명해보세요
              </p>
              <ul className="text-sm text-gray-500 text-left">
                <li>• 두 밑각의 크기는 같다</li>
                <li>• 꼭지각의 이등분선은 밑변을 수직이등분한다</li>
              </ul>
            </div>
          </Link>

          <div className="bg-gray-100 rounded-xl shadow-lg p-6 opacity-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">평행선의 성질</h3>
              <p className="text-gray-500 mb-4">
                곧 출시 예정
              </p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl shadow-lg p-6 opacity-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">삼각형의 내각</h3>
              <p className="text-gray-500 mb-4">
                곧 출시 예정
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
