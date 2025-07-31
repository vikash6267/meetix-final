import { setUser, setToken } from "../../redux/authSlice";
import { saveNews } from "../../redux/newsSlice";
import { apiConnector } from "../apiConnector";
import { endpoints, adminEndpoints } from "../apis";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const { LOGIN_API, SIGNUP_API, SEND_OTP_API, VERIFY_OTP_API, GET_SINGEL_USER } = endpoints;

const {
  ADD_NEWS_API,
  UPDATE_NEWS_API,
  GET_ALL_NEWS_API,
  DELETE_NEWS_API,
  DETAILS_NEWS_API,
  STATUS_NEWS_API,
  IMAGE_UPLOAD,

  ADD_CATEGORY_API,
  UPDATE_CATEGORY_API,
  GET_ALL_CATEGORY_API,
  DETAILS_CATEGORY_API,
  DELETE_CATEGORY_API,

  ADD_SUBCATEGORY_API,
  GET_ALL_SUBCATEGORY_API,
  UPDATE_SUBCATEGORY_API,
  DELETE_SUBCATEGORY_API,
  DETAILS_SUBCATEGORY_API,

  CREATE_BREAKING_NEWS,
  GET_ALL_BREAKING_NEWS,
  DELETE_BREAKING_NEWS,
  ACTIVE_BREAKING_NEWS,
  //nOTIFICATION
  ALL_NOTIFICATIONS_API,




  // LIve
  CREATE_LIVE_NEWS,
  GET_ALL_LIVE_NEWS,
  DELETE_LIVE_NEWS,


} = adminEndpoints;

export async function signUp(formData, navigate, dispatch) {

  Swal.fire({
    title: "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    const response = await apiConnector("POST", SIGNUP_API, formData);

    console.log("SIGNUP API RESPONSE............", response);

    if (!response.data.success) {
      // toast.error(response.data.message)
      throw new Error(response.data.message);
    }

    console.log(response?.data?.user)
    dispatch(setToken(response?.data?.token))
    dispatch(setUser(response?.data?.user))
    localStorage.setItem("user", JSON.stringify(response.data.user))

    localStorage.setItem("token", JSON.stringify(response.data.token))

    navigate("/");

  } catch (error) {
    console.log("SIGNUP API ERROR............", error);
    // navigate("/login");
  }
  Swal.close();

}

export async function login(email, password, navigate, dispatch) {
  Swal.fire({
    title: "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", LOGIN_API, {
      email,
      password,
    });
    Swal.close();
    if (!response?.data?.success) {
      await
        Swal.fire({
          title: "Login Failed",
          text: response.data.message,
          icon: "error",
        });
      throw new Error(response.data.message);
    }

    Swal.fire({
      title: `Login Successfully!`,
      text: `Have a nice day!`,
      icon: "success",
    });
    dispatch(setToken(response?.data?.token));
    dispatch(setUser(response.data.user));
    navigate("/admin/dashboard");
  } catch (error) {
    console.log("LOGIN API ERROR............", error);
    Swal.fire({
      title: "Login Failed",
      text:
        error.response?.data?.message ||
        "Something went wrong, please try again later",
      icon: "error",
    });
  }
}

export const getSingleUserApi = async (id) => {
  try {
    const response = await apiConnector("GET", `${GET_SINGEL_USER}/${id}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch user data");
    }

    return response?.data?.user || null;
  } catch (error) {
    console.error("Error in getting user:", error.message || error);

    return null; // Return null instead of an empty array for a single user fetch
  }
};




export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")

    let result = []

    try {
      const response = await apiConnector("POST", SEND_OTP_API, {
        email
      })
      // console.log("SENDOTP API RESPONSE............", response)

      // console.log(response.data.success)
      result = response.data.success
      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      // navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
      return result
    }

    toast.dismiss(toastId)
    return result

  }
}



export function compareOtp(otp, email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    let result = true
    try {
      const response = await apiConnector("POST", VERIFY_OTP_API, {
        otp, email
      })
      console.log("Compare API RESPONSE............", response)


      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      if (response?.data?.userFind) {
        console.log(response.data.token)
        dispatch(setToken(response.data.token))
        dispatch(setUser(response.data.existingUser))
        localStorage.setItem("user", JSON.stringify(response.data.existingUser))

        localStorage.setItem("token", JSON.stringify(response.data.token))
        navigate("/profile")


        toast.success("Login Succesfully")
        toast.dismiss(toastId)

        return
      }
      result = response?.data?.userFind

      Swal.fire({
        title: "Login Failed",
        text:
          "Your Not Admin Please Contact To SuperAdmin",
      });


      // navigate("/verify-email")
    } catch (error) {
      console.log("COMPARE API ERROR............", error)
      // toast.error(error?.response?.data?.message)

      Swal.fire({
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong, please try again later",
        icon: "error",
      });
    }
    toast.dismiss(toastId)
    return result
  }
}













export const getAllNews = () => async (dispatch) => {
  try {
    const response = await apiConnector("GET", GET_ALL_NEWS_API);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch News");
    }

    const result = response?.data?.news;
    dispatch(saveNews(result)); // Dispatching action to save products
    return result;
  } catch (error) {
    console.log("GET_ALL_NEWS_API API ERROR:", error);

    return [];
  }
};

//Admin

export const createNews = async (data, token) => {
  console.log(data);

  let swalLoadingInstance;

  Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      swalLoadingInstance = Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", ADD_NEWS_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("CREATE News API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Add News Details");
    }

    Swal.fire({
      icon: "success",
      title: "News Details Added Successfully",
    });
  } catch (error) {
    console.log("CREATE News API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.response?.data?.message,

    });
  } finally {
    if (swalLoadingInstance) {
      Swal.close();
    }
  }
};

export const editNews = async (data, token) => {
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", UPDATE_NEWS_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("EDIT News API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Update News Details");
    }

    Swal.fire({
      icon: "success",
      title: "News Details Updated Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("EDIT News API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.response?.data?.message,
    });
  } finally {
    Swal.close(toastId);
  }
};


export const deleteNews = async (id, token) => {


  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_NEWS_API,
      { id },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("DELETE Product API RESPONSE............", response.data);


    if (!response?.data?.success) {
      throw new Error(toast.error("Could Not Delete Product"));
    }
    toast.success("Product deleted successfully!")

  } catch (error) {
    console.log(error)
    toast.error("Error in deleting news")
  }
};


export const getSingleNews = async (newsId) => {
  try {
    const response = await apiConnector("GET", `${DETAILS_NEWS_API}/${newsId}`);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch News");
    }

    const result = response?.data?.news;

    return result;
  } catch (error) {
    console.log("GET_ALL_NEWS_API API ERROR:", error);

    return [];
  }
};

export const activeToggle = async (data, token) => {
  console.log(data);
  Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("PUT", STATUS_NEWS_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("Toggle News API RESPONSE............", response?.data?.success);

    if (!response?.data?.success) {
      throw new Error("Could Not Add News Details");
    }

    Swal.close();
    Swal.fire({
      icon: "success",
      title: "News Details Added Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("Toggle News API ERROR............", error);
    Swal.close();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
};

//CateGory

export const createCategory = async (data, token) => {
  // console.log(data);
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", ADD_CATEGORY_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("CREATE Category API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Add Category Details");
    }

    Swal.fire({
      icon: "success",
      title: "Category Details Added Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("CREATE Category API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }
};

export const updateCategory = async (data, token) => {
  // console.log(data);
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", UPDATE_CATEGORY_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("UPDATE Category API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Add Category  UPDATE Details");
    }

    Swal.fire({
      icon: "success",
      title: "Category UPDATE Details Added Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("CREATE Category API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }
};

export const deleteCategory = async (id, token) => {
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_CATEGORY_API}/${id}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("DELETE Category API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Category");
    }

    Swal.fire({
      icon: "success",
      title: "Category Deleted Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("DELETE Category API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }
};

export const fetchSingleCategory = async (id) => {
  let result = [];
  try {
    const response = await apiConnector("GET", `${DETAILS_CATEGORY_API}/${id}`);
    console.log("News_CATEGORIES_API API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch  Categories");
    }

    result = response?.data;
  } catch (error) {
    console.log("CATEGORY_API API ERROR............", error);
  }
  return result;
};

export const fetchCategory = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_CATEGORY_API);
    // console.log("News_CATEGORIES_API API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch News Categories");
    }
    // console.log(response?.data)

    result = response?.data;
  } catch (error) {
    console.log("News_CATEGORY_API API ERROR............", error);
  }
  return result;
};

//SubCateGory

export const createSubCategory = async (data, token) => {
  console.log(data);
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", ADD_SUBCATEGORY_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("CREATE SubCategory API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Add SubCategory Details");
    }

    Swal.fire({
      icon: "success",
      title: "SubCategory Details Added Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("CREATE SubCategory API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }
};

export const updateSubCategory = async (data, token) => {
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", UPDATE_SUBCATEGORY_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("UPDATE SubCategory API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Update SubCategory Details");
    }

    Swal.fire({
      icon: "success",
      title: "SubCategory Details Updated Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("UPDATE SubCategory API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }
};

export const deleteSubCategory = async (id, token) => {
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_SUBCATEGORY_API}/${id}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("DELETE SubCategory API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Delete SubCategory");
    }

    Swal.fire({
      icon: "success",
      title: "SubCategory Deleted Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("DELETE SubCategory API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }
};

export const fetchSingleSubCategory = async (id) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      `${DETAILS_SUBCATEGORY_API}/${id}`
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch SubCategory Details");
    }
    result = response?.data;
  } catch (error) {
    console.log("FETCH SINGLE SubCategory API ERROR............", error);
  }
  return result;
};

// breakig news

export const createBreakingNews = async (data, token) => {
  console.log(data);
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", CREATE_BREAKING_NEWS, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("Breaking news API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Add breaking news Details");
    }

    Swal.fire({
      icon: "success",
      title: "Breaking News Added Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("CREATE breaking news API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }
};

export const fetchBreakingNews = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_BREAKING_NEWS);
    if (!response?.data?.success) {
      throw new Error("Could not fetch breaking news categories");
    }
    return response.data.breakingNewss; // Corrected the return statement
  } catch (error) {
    console.error("Error fetching breaking news:", error); // Changed console.log to console.error for error logging
    return []; // Return an empty array or handle the error as needed
  }
};

export const deleteBreakingNews = async (id, token) => {
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_BREAKING_NEWS}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("DELETE breaking news API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Breaking News");
    }

    Swal.fire({
      icon: "success",
      title: "Breaking News Deleted Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("DELETE breaking news API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close();
  }
};

export const fetchSubCategory = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_SUBCATEGORY_API);
    // console.log("News_SUB CATEGORIES_API API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch News Categories");
    }

    result = response?.data?.subCategories;
  } catch (error) {
    // console.log("News_CATEGORY_API API ERROR............", error)
  }
  return result;
};

//Image

export const imageUpload = async (data, token) => {
  let result = [];
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const formData = new FormData();
    for (let i = 0; i < data.length; i++) {
      formData.append("thumbnail", data[i]);
    }

    const response = await apiConnector("POST", IMAGE_UPLOAD, formData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Add Image Details");
    }

    Swal.fire({
      icon: "success",
      title: "Image Details Added Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    result = response?.data?.images;
  } catch (error) {
    console.log("CREATE IMAGE API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }

  return result;
};

//nOTIFICATIONS

export const fetchNotification = async () => {
  try {
    const response = await apiConnector("POST", ALL_NOTIFICATIONS_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch notifications");
    }
    return response?.data?.notifications; // Corrected the return statement
  } catch (error) {
    console.error("Error fetching notification news:", error); // Changed console.log to console.error for error logging
    return []; // Return an empty array or handle the error as needed
  }
};










//Live

export const createLiveStream = async (data, token) => {
  console.log(data);
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", CREATE_LIVE_NEWS, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("Live news API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Add Live News Details");
    }

    Swal.fire({
      icon: "success",
      title: "Live News Added Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("CREATE live news API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close(toastId);
  }
};

export const fetchLiveStreams = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_LIVE_NEWS);
    if (!response?.data?.success) {
      throw new Error("Could not fetch live news categories");
    }
    return response.data.liveStreams; // Corrected the return statement
  } catch (error) {
    console.error("Error fetching live news:", error); // Changed console.log to console.error for error logging
    return []; // Return an empty array or handle the error as needed
  }
};

export const deleteLiveStream = async (id, token) => {
  const toastId = Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_LIVE_NEWS}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("DELETE live news API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Live News");
    }

    Swal.fire({
      icon: "success",
      title: "Live News Deleted Successfully",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log("DELETE live news API ERROR............", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    Swal.close();
  }
};
