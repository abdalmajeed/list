<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import Modal from "@/components/Modal.vue";
import Item from "@/components/Item.vue";
import Card from "@/components/Card.vue";
import Search from "@/components/Search.vue";
import "@/html2canvas";
import axios from "axios";

// import jsonData from "../public/hello.json";
onMounted(async () => {
  getData();
  const currentTheme = await localStorage.getItem("theme");
  if (currentTheme === "dark") changeTheme();
});

// methods
const changeTheme = async () => {
  document.body.classList.toggle("dark");
  const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
  theme.value = newTheme;
  await localStorage.setItem("theme", newTheme);
};
const setDelete = (value) => {
  deleteModal.value = value;
};
const setAdd = (value) => {
  addModal.value = value;
};
const setService = (service) => {
  selectedService.value = service;
  setTimeout(() => {
    copy();
  }, 100);
};
const setLoading = (value) => {
  loading.value = value;
};
const shot = () => {
  setLoading("shot");
  const img = new Image();
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");

  function setCanvasImage(path, func) {
    img.onload = function () {
      c.width = this.naturalWidth;
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);
      c.toBlob((blob) => {
        func(blob);
      }, "image/png");
    };
    img.src = path;
  }
  const divElement = document.getElementById("card");

  // Use html2canvas to convert the div to an image
  html2canvas(divElement)
    .then((canvas) => {
      // Convert the canvas to a data URL
      const imgData = canvas.toDataURL();
      setCanvasImage(imgData, (imgBlob) => {
        navigator.clipboard
          .write([new ClipboardItem({ "image/png": imgBlob })])
          .then((e) => {
            setLoading(false);
            alertMsg("تم نسخ الخدمة كصورة");
          })
          .catch((e) => {
            setLoading(false);
            console.log(e);
          });
      });
    })
    .catch((error) => {
      setLoading(false);
      console.error("Failed to convert div to image:", error);
    });
};
const copy = () => {
  setLoading("copy");
  const text = document.getElementById("message").textContent;
  navigator.clipboard
    .writeText(text)
    .then((e) => {
      setLoading(false);
      alertMsg("تم نسخ وصف الحدمة كنص");
    })
    .catch((e) => {
      setLoading(false);
      console.log(e);
    });
};
const openPicker = () => {
  document.getElementById("img-file").click();
};
const pick = (e) => {
  const imgToSend = (e.target.files || e.dataTransfer.files)[0];
  addModal.value.image = imgToSend;
  addModal.value.img = URL.createObjectURL(
    (e.target.files || e.dataTransfer.files)[0]
  );
};
const alertMsg = (text) => {
  msg.value = text;
  setTimeout(() => {
    msg.value = "";
  }, 2500);
};
const getData = () => {
  fetch("/api/get_data")
    .then((res) => res.json())
    .then((res) => {
      data.value = res?.services;
      links.value = res?.links;
    });
};
const deleteService = async () => {
  loading.value = "delete";
  const form = new FormData();
  form.append("id", selectedService.value?.id);
  const res = await axios.post("/api/delete_service", form);
  if (res.data === "success") {
    deleteModal.value = false;
    selectedService.value = null;
    getData();
    alertMsg("تم حذف الخدمة");
  } else alertMsg("فشل حذف الخدمة!");
  loading.value = false;
};
const addLink = async (e) => {
  e.preventDefault();
  loading.value = "add";

  if (!addModal.value?.title) {
    alertMsg("عنوان الرابط مطلوب!");
    loading.value = false;
    return;
  }
  if (!addModal.value?.url) {
    alertMsg("الرابط مطلوب!");
    loading.value = false;
    return;
  }

  const form = new FormData();
  form.append("title", addModal.value?.title);
  form.append("url", addModal.value?.url);
  const res = await axios.post("/api/add_link", form);
  if (res.data === "success") {
    addModal.value = false;
    getData();
    alertMsg("تم إضافة الرابط");
  } else alertMsg("فشل إضافة الرابط!");

  loading.value = false;
};
const deleteLink = async () => {
  loading.value = "delete";
  const form = new FormData();
  form.append("id", selectedLink.value?.id);
  const res = await axios.post("/api/delete_link", form);
  if (res.data === "success") {
    deleteModal.value = false;
    selectedLink.value = null;
    getData();
    alertMsg("تم حذف الرابط");
  } else alertMsg("فشل حذف الرابط!");
  loading.value = false;
};
const addService = async (e) => {
  e.preventDefault();
  loading.value = "add";

  if (!addModal.value?.title) {
    alertMsg("عنوان الخدمة مطلوب!");
    loading.value = false;
    return;
  }
  if (!addModal.value?.description) {
    alertMsg("وصف الخدمة مطلوب!");
    loading.value = false;
    return;
  }

  const form = new FormData();
  form.append("title", addModal.value?.title);
  form.append("description", addModal.value?.description);
  form.append("image", addModal.value?.image);
  const res = await axios.post("/api/add_service", form);
  if (res.data === "success") {
    addModal.value = false;
    getData();
    alertMsg("تم إضافة الخدمة");
  } else alertMsg("فشل إضافة الخدمة!");

  loading.value = false;
};
const saveNote = async (e) => {
  await localStorage.setItem("note", noteModal.value.note);
  alertMsg("تم حفظ الملاحظة");
  noteModal.value.show = false;
  loading.value = false;
};
const openNote = async (e) => {
  const note = await localStorage.getItem("note");
  noteModal.value.show = true;
  noteModal.value.note = note || "";
};
const highlight = (text) => {
  return String(text).replaceAll(
    search.value,
    `<span class="bg-yellow-300 dark:bg-yellow-100 dark:text-black">${search.value}</span>`
  );
};
// data
const theme = ref("light");
const search = ref("");
const loading = ref(false);
const deleteModal = ref(false);
const addModal = ref(false);
const addType = ref("service");
const selectedService = ref(null);
const selectedLink = ref(null);
const noteModal = ref({ show: false, note: "" });
const msg = ref("");
const data = ref([]);
const links = ref([]);

// computed
const services = computed(() => {
  return data.value.filter(
    (i) =>
      i.title.includes(search.value) || i.description?.includes(search.value)
  );
});
</script>

<template>
  <!-- services list -->
  <div
    class="w-full h-screen fixed inset-0 flex bg-gray-100/90 dark:bg-gray-900 items-center justify-center lg:p-12 transition-all duration-300"
  >
    <div class="rounded-2xl overflow-hidden max-w-2xl w-full h-full">
      <!-- This is an example component -->
      <div class="w-full h-full">
        <div
          class="py-10 px-4 bg-white h-full dark:bg-gray-800 dark:border-gray-700"
        >
          <!-- Title -->
          <div class="px-10 flex items-center mb-2">
            <h1
              class="text-2xl font-bold leading-none text-gray-900 dark:text-white"
            >
              الخدمات
            </h1>

            <button
              class="mr-auto"
              @click="() => setAdd({ title: '', description: '', image: '' })"
            >
              <img
                class="w-7 rotate-4i5 mb-1 filter-arrow"
                src="@/assets/plus.svg"
                alt="add"
              />
            </button>
            <button class="mx-4" @click="openNote">
              <img
                class="w-7 mb-1 filter-arrow"
                src="@/assets/note.svg"
                alt="note"
              />
            </button>
            <button @click="changeTheme">
              <img
                v-show="theme === 'light'"
                class="w-8 mb-1 filter-arrow"
                src="@/assets/moon.svg"
                alt="moon"
              />
              <img
                v-show="theme === 'dark'"
                class="w-8 mb-1 filter-arrow"
                src="@/assets/sun.svg"
                alt="sun"
              />
            </button>
          </div>

          <!-- links -->
          <div class="w-full flex flex-wrap gap-2 my-4 px-10">
            <div
              v-for="(link, index) in links"
              class="px-4 py-1 flex items-center justify-center gap-x-2 relative border border-gray-300 rounded-full"
            >
              <a
                :href="link?.url"
                :target="`file-manager`"
                class="mt-1 dark:text-white"
              >
                {{ link?.title }}
              </a>
              <img
                @click="
                  () => {
                    selectedLink = link;
                    setDelete(true);
                  }
                "
                :class="`rotate-45 w-4 ${
                  theme === 'light' ? 'filter-red' : 'filter-arrow'
                } cursor-pointer`"
                src="@/assets/plus.svg"
                alt="delete"
              />
            </div>
          </div>

          <!-- Search -->
          <Search v-model="search" />

          <!-- List -->
          <div class="flow-root overflow-y-auto h-full w-full px-10">
            <ul v-if="services?.length" role="list">
              <Item
                v-for="{ id, title, description, img } in services"
                :id="id"
                :title="highlight(title)"
                :description="description"
                :img="img"
                @delete="() => setDelete(true)"
                @select="(service) => setService(service)"
              />
              <div class="h-32" />
            </ul>
            <div
              v-else
              class="w-full h-96 flex items-center justify-center text-center text-gray-500/50 mt-12 text-xl"
            >
              لا يوجد خدمات لعرضها
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- selceted service modal -->
  <Modal v-if="selectedService" @close="() => setService(null)">
    <Card
      :img="selectedService?.img"
      :description="selectedService?.description"
      @copy="copy"
    />
    <div
      class="md:w-16 md:h-max w-max h-16 p-2 flex md:flex-col items-center gap-x-2 md:gap-y-2 rounded-xl absolute -bottom-[4.5rem] left-0 md:top-0 md:-left-[4.5rem] bg-gray-100 dark:bg-gray-700"
    >
      <button
        @click="copy"
        class="w-full h-12 rounded-full flex items-center justify-center hover:bg-gray-200/80 dark:hover:bg-gray-600/60"
      >
        <img
          class="w-8 filter-arrow dark:opacity-50"
          src="@/assets/loading.svg"
          alt="loading"
          v-if="loading === 'copy'"
        />
        <img
          class="w-8 filter-arrow dark:opacity-50"
          src="@/assets/copy.svg"
          alt="copy"
          v-else
        />
      </button>
      <button
        @click="shot"
        class="w-full h-12 rounded-full flex items-center justify-center hover:bg-gray-200/80 dark:hover:bg-gray-600/60"
      >
        <img
          class="w-8 filter-arrow dark:opacity-50"
          src="@/assets/loading.svg"
          alt="loading"
          v-if="loading === 'shot'"
        />
        <img
          class="w-8 filter-arrow dark:opacity-50"
          src="@/assets/shot.svg"
          alt="shot"
          v-else
        />
      </button>
      <button
        @click="() => setDelete(true)"
        class="w-full h-12 rounded-full flex items-center justify-center hover:bg-gray-200/80 dark:hover:bg-gray-600/60"
      >
        <img
          class="w-8 filter-red opacity-60 dark:opacity-70"
          src="@/assets/trash.svg"
          alt="trash"
        />
      </button>
    </div>
  </Modal>

  <!-- add service -->
  <Modal v-if="addModal" type="add">
    <div>
      <div class="w-full flex items-center justify-center gap-x-4 mb-4">
        <button
          :class="`${
            addType === 'service'
              ? 'text-blue-500 dark:text-white'
              : 'text-gray-400'
          } text-lg`"
          @click="() => (addType = 'service')"
        >
          خدمة
        </button>
        <button
          :class="`${
            addType === 'link'
              ? 'text-blue-500 dark:text-white'
              : 'text-gray-400'
          } text-lg`"
          @click="() => (addType = 'link')"
        >
          رابط
        </button>
      </div>
      <!--body-->
      <form v-if="addType === 'service'" @submit="addService">
        <div
          @click="openPicker"
          v-if="!addModal?.img"
          class="cursor-pointer w-full h-56 rounded-xl bg-gray-200/50 dark:bg-gray-800/40 flex items-center justify-center"
        >
          <img
            src="../assets/img.svg"
            class="w-20 filter-arrow opacity-40"
            alt="img"
          />
        </div>
        <img v-else :src="addModal?.img" class="w-full rounded-xl" alt="img" />
        <input @change="pick" type="file" id="img-file" hidden />

        <input
          v-model="addModal.title"
          class="w-full mt-2 py-3 px-6 rounded-xl dark:text-white bg-gray-200/50 dark:bg-gray-800/40"
          placeholder="عنوان الخدمة"
        />

        <textarea
          v-model="addModal.description"
          class="w-full mt-2 h-32 py-3 px-6 rounded-xl dark:text-white bg-gray-200/50 dark:bg-gray-800/40"
          placeholder="وصف الخدمة"
        ></textarea>

        <!--footer-->
        <div class="mt-2 mb-4 text-center gap-x-4 md:block">
          <button
            type="reset"
            @click="() => setAdd(false)"
            class="mb-2 md:mb-0 bg-white dark:bg-gray-200 px-10 mx-1 py-2 text-sm font-medium tracking-wider border text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            class="mb-2 md:mb-0 mx-1 bg-blue-500 dark:bg-gray-900 border border-blue-500 dark:border-gray-900 px-10 py-2 text-sm font-medium tracking-wider text-white rounded-full hover:bg-blue-600 dark:hover:bg-gray-800 hover:border-blue-600 dark:hover:border-gray-800"
          >
            <span v-if="loading === 'add'"> ... </span>
            <span v-else> إضافة </span>
          </button>
        </div>
      </form>

      <form v-else-if="addType === 'link'" @submit="addLink">
        <input
          v-model="addModal.title"
          class="w-full mt-2 py-3 px-6 rounded-xl dark:text-white bg-gray-200/50 dark:bg-gray-800/40"
          placeholder="عنوان الرابط"
        />
        <input
          v-model="addModal.url"
          class="w-full mt-2 py-3 px-6 rounded-xl dark:text-white bg-gray-200/50 dark:bg-gray-800/40"
          placeholder="الرابط"
        />

        <!--footer-->
        <div class="mt-6 mb-4 text-center gap-x-4 md:block">
          <button
            type="reset"
            @click="() => setAdd(false)"
            class="mb-2 md:mb-0 bg-white dark:bg-gray-200 px-10 mx-1 py-2 text-sm font-medium tracking-wider border text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            class="mb-2 md:mb-0 mx-1 bg-blue-500 dark:bg-gray-900 border border-blue-500 dark:border-gray-900 px-10 py-2 text-sm font-medium tracking-wider text-white rounded-full hover:bg-blue-600 dark:hover:bg-gray-800 hover:border-blue-600 dark:hover:border-gray-800"
          >
            <span v-if="loading === 'add'"> ... </span>
            <span v-else> إضافة </span>
          </button>
        </div>
      </form>
    </div>
  </Modal>

  <!-- delete modal -->
  <Modal v-if="(selectedService || selectedLink) && deleteModal" type="delete">
    <div class="">
      <!--body-->
      <div class="text-center p-5 flex-auto justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-16 h-16 flex items-center text-red-500 mx-auto"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <h2 class="text-xl dark:text-white font-bold mt-6 mb-2">
          هل أنت متأكد من حذف {{ selectedLink ? "الرابط؟" : "الخدمة؟" }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-300 px-8">
          لا يمكن استعادة {{ selectedLink ? "الرابط؟" : "الخدمة؟" }} بعد حذفها
        </p>
      </div>
      <!--footer-->
      <div class="mt-2 mb-4 text-center gap-x-4 md:block">
        <button
          @click="
            () => {
              setDelete(false);
              selectedLink = null;
            }
          "
          class="mb-2 md:mb-0 bg-white dark:bg-gray-200 px-10 mx-1 py-2 text-sm font-medium tracking-wider border text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          v-if="selectedLink"
          @click="deleteLink"
          class="mb-2 md:mb-0 mx-1 bg-red-500 border border-red-500 px-10 py-2 text-sm font-medium tracking-wider text-white rounded-full hover:bg-red-600 hover:border-red-600"
        >
          <span v-if="loading === 'delete'"> ... </span>
          <span v-else> حذف </span>
        </button>
        <button
          v-else
          @click="deleteService"
          class="mb-2 md:mb-0 mx-1 bg-red-500 border border-red-500 px-10 py-2 text-sm font-medium tracking-wider text-white rounded-full hover:bg-red-600 hover:border-red-600"
        >
          <span v-if="loading === 'delete'"> ... </span>
          <span v-else> حذف </span>
        </button>
      </div>
    </div>
  </Modal>

  <!-- note modal -->
  <Modal @close="saveNote" v-if="noteModal.show" type="note">
    <div>
      <!--body-->
      <textarea
        v-model="noteModal.note"
        class="w-full mt-2 h-96 py-3 px-6 rounded-xl dark:text-white bg-gray-200/50 dark:bg-gray-800/40"
        placeholder="ملاحظة"
      ></textarea>
    </div>
  </Modal>

  <!-- msg box -->
  <div
    v-if="msg"
    class="h-12 z-50 px-6 flex items-center justify-center text-center bg-blue-500 dark:bg-gray-900 pt-1 rounded-full fixed bottom-16 right-1/2 translate-x-1/2 text-white"
  >
    {{ msg }}
  </div>
</template>
