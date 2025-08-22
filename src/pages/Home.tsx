/**
 * Home Page Component
 * 
 * This is the landing page of the geometry education application that serves
 * as the main module selection interface. It presents available geometry lesson
 * modules in a visually appealing card-based layout.
 * 
 * Features:
 * - Clean, modern design with gradient background
 * - Interactive module cards with hover effects
 * - Clear descriptions of what each module teaches
 * - Visual indicators for available vs. upcoming modules
 * - Responsive layout that works on different screen sizes
 * 
 * Available Modules:
 * - Isosceles Triangle: Interactive proof of isosceles triangle properties
 * - RHA/RHS Congruence: Right triangle congruence with constraint-based approach
 * - Future modules: Parallel lines and triangle interior angles (coming soon)
 */

import { Link } from 'react-router-dom';

/**
 * Home page component with module selection interface
 * 
 * Renders the main navigation page where users can choose between
 * different geometry lesson modules. Uses React Router Link components
 * for client-side navigation.
 * 
 * @returns JSX element containing the home page layout with module cards
 */
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

          <Link
            to="/rha-rhs"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h16M8 20V4l8 8-8 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">직각삼각형 RHA/RHS</h3>
              <p className="text-gray-600 mb-4">제약으로 자유도를 0으로 만드는 합동 발견</p>
              <ul className="text-sm text-gray-500 text-left">
                <li>• 직각 잠금, 빗변/각·변 잠금</li>
                <li>• DoF 게이지, 겹쳐보기, 합동 판정</li>
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
