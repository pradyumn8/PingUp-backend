import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import moment from 'moment'
import ProfileModel from '../components/ProfileModel'

const Profile = () => {
  const { profileId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async () => {
    setUser(dummyUserData)
    setPosts(dummyPostsData)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return user ? (
    <div className='relative h-full overscroll-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {user.cover_photo && <img src={user.cover_photo} alt='' className='w-full h-full object-cover' />}
          </div>
          {/* User Info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>
        {/* tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {["posts", "media", "likes"].map((tab) => (
              <button onClick={() => setActiveTab(tab)} key={tab} className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* posts */}
          {activeTab === 'posts' && (
            <div>
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          )}

          {/* Media */}
          {/* Media */}
          {activeTab === 'media' && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {posts
                .filter(post => post.image_urls.length > 0)
                .flatMap(post =>
                  post.image_urls.map((image, idx) => (
                    <Link
                      key={`${post._id}-${idx}`}
                      to={image}
                      target="_blank"
                      className="relative block overflow-hidden group"
                    >
                      {/* fixed-height for consistent rows */}
                      <img
                        src={image}
                        alt=""
                        className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      {/* timestamp overlay */}
                      <span className="absolute bottom-2 right-2 bg-white bg-opacity-60 text-gray-600 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {moment(post.createdAt).fromNow()}
                      </span>
                    </Link>
                  ))
                )}
            </div>
          )}

        </div>
      </div>
      {/* Edit profile model */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit}/>}
    </div>
  ) : (<Loading />)
}

export default Profile